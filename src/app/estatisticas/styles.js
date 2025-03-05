import styled from "styled-components";

export const StatisticsContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f7f9fc;
`;

export const StatisticsContent = styled.div`
  flex: 1;
  padding: 20px;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

export const StatisticsHeader = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 30px;
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 20px;
  }
`;

export const ChartContainer = styled.div`
  margin: 20px auto;
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 1200px;
  overflow-x: auto;
  overflow-y: hidden;
  
  canvas {
    max-height: 400px;
    width: 100% !important;
    height: auto !important;
  }
`;

export const ChartTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  text-align: center;
`;

export const LoadingMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #666;
`;

export const ErrorMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
  font-size: 1.2rem;
  color: #e74c3c;
  text-align: center;
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  gap: 10px;
`;

export const FilterLabel = styled.label`
  font-size: 1rem;
  color: #333;
  font-weight: 500;
`;

export const FilterSelect = styled.select`
  padding: 8px 12px;
  border-radius: 4px;
  border: 1px solid #ddd;
  background-color: white;
  font-size: 1rem;
  color: #333;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin: 20px 0;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

export const StatisticsCard = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  text-align: center;
  
  div {
    font-size: 1.8rem;
    font-weight: 600;
    color: #3498db;
    margin-top: 10px;
  }
`;

export const StatisticsCardTitle = styled.h3`
  font-size: 1rem;
  color: #666;
  margin: 0;
  font-weight: 500;
`;
