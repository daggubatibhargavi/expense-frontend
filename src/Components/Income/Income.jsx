import React, { useEffect } from "react";
import styled from "styled-components";
import { useGlobalContext } from "../../context/GlobalContext";
import { InnerLayout } from "../../styles/Layouts";
import Form from "../Form/Form";
import IncomeItem from "../IncomeItem/IncomeItem";

function Income() {
  const { 
    incomes, 
    getIncomes, 
    deleteIncome, 
    totalIncome, 
    loading, 
    error, 
    isAuthenticated,
    guestLogin, 
    clearError 
  } = useGlobalContext();

  useEffect(() => {
    // If not authenticated, try guest login first
    if (!isAuthenticated) {
      console.log("Not authenticated, attempting guest login...");
      guestLogin();
    }
  }, [isAuthenticated, guestLogin]);

  useEffect(() => {
    // Only fetch incomes if authenticated
    if (isAuthenticated) {
      console.log("Authenticated, fetching incomes...");
      getIncomes();
    }
  }, [isAuthenticated, getIncomes]);

  // Handle authentication error
  const handleRetry = () => {
    clearError();
    if (!isAuthenticated) {
      guestLogin();
    } else {
      getIncomes();
    }
  };

  return (
    <IncomeStyled>
      <InnerLayout>
        <h1>Incomes</h1>
        <h2 className="total-income">
          Total Income: <span>₹{totalIncome}</span>
        </h2>
        <div className="income-content">
          <div className="form-container">
            <Form />
          </div>
          <div className="incomes">
            {loading ? (
              <div className="loading">
                <h3>Loading income data...</h3>
                <p>Please wait while we fetch your data...</p>
              </div>
            ) : error ? (
              <div className="error">
                <h3>Unable to Load Data</h3>
                <p>{error}</p>
                <button onClick={handleRetry} className="retry-btn">
                  {!isAuthenticated ? "Try Guest Login" : "Retry"}
                </button>
              </div>
            ) : !isAuthenticated ? (
              <div className="auth-required">
                <h3>Authentication Required</h3>
                <p>Please wait while we authenticate you...</p>
                <button onClick={guestLogin} className="auth-btn">
                  Continue as Guest
                </button>
              </div>
            ) : incomes && incomes.length > 0 ? (
              incomes.map((income) => (
                <IncomeItem
                  key={income._id}
                  id={income._id}
                  title={income.title}
                  description={income.description}
                  amount={income.amount}
                  date={income.date}
                  type={income.type}
                  category={income.category}
                  indicatorColor="var(--color-green)"
                  deleteItem={deleteIncome}
                />
              ))
            ) : (
              <div className="no-data">
                <h3>No income data found</h3>
                <p>Add a new income entry using the form on the left</p>
              </div>
            )}
          </div>
        </div>
      </InnerLayout>
    </IncomeStyled>
  );
}

const IncomeStyled = styled.div`
  display: flex;
  overflow: hidden;
  flex-direction: column;
  margin-right: 1rem !important;
  width: 100%;
  
  h1 {
    color: var(--primary-color);
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .total-income {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #fcf6f9;
    border: 2px solid #ffffff;
    box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
    border-radius: 20px;
    padding: 1rem 2rem;
    margin: 1rem 0;
    font-size: 1.8rem;
    
    span {
      font-size: 2rem;
      font-weight: 800;
      color: var(--color-red, #ff5757);
    }
  }
  
  .income-content {
    display: flex;
    gap: 2rem;
    width: 100%;
    max-width: 100%;
    
    .form-container {
      flex: 1;
      min-width: 0;
    }
    
    .incomes {
      flex: 2;
      min-width: 0;
      
      .no-data, .loading, .error, .auth-required {
        background: #fcf6f9;
        border: 2px solid #ffffff;
        box-shadow: 0px 1px 15px rgba(0, 0, 0, 0.06);
        border-radius: 20px;
        padding: 2rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        min-height: 300px;
        
        h3 {
          font-size: 1.5rem;
          color: var(--primary-color);
          margin: 0;
        }
        
        p {
          color: var(--primary-color);
          opacity: 0.8;
          margin: 0;
        }
      }
      
      .error {
        border-color: #ff5757;
        background: #ffebee;
        
        h3 {
          color: #ff5757;
        }
        
        .retry-btn {
          background: #ff5757;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 1rem;
          transition: all 0.3s ease;
          
          &:hover {
            background: #ff4444;
            transform: translateY(-2px);
          }
        }
      }
      
      .loading {
        border-color: #2196f3;
        background: #e3f2fd;
        
        h3 {
          color: #2196f3;
        }
      }
      
      .auth-required {
        border-color: #ff9800;
        background: #fff3e0;
        
        h3 {
          color: #ff9800;
        }
        
        .auth-btn {
          background: #ff9800;
          color: white;
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          margin-top: 1rem;
          transition: all 0.3s ease;
          
          &:hover {
            background: #f57c00;
            transform: translateY(-2px);
          }
        }
      }
    }
  }
  
  @media screen and (max-width: 768px) {
    .income-content {
      flex-direction: column;
    }
  }
`;

export default Income;
