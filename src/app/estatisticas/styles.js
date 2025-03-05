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
  
  @media (max-width: 768px) {
    font-size: 1.2rem;
    margin-bottom: 15px;
  }
`;

export const LoadingMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #666;
`;

export const ErrorMessage = styled.div`
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #d9534f;
  background-color: #f9f2f2;
  border-radius: 4px;
  margin: 20px 0;
`;

export const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

export const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const FilterLabel = styled.label`
  margin-right: 10px;
  font-weight: 500;
  
  @media (max-width: 768px) {
    margin-bottom: 5px;
  }
`;

export const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #4299e1;
    box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;
