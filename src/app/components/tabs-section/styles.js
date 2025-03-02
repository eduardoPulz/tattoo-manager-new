import styled from "styled-components";
import { FaEdit as EditIcon, FaTrash as TrashIcon } from 'react-icons/fa';

export const TabsContainer = styled.nav`
  background-color: #fff;
  display: flex;
  padding: 16px 70px;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #eee;
  
  @media (max-width: 991px) {
    padding-left: 20px;
    padding-right: 20px;
  }
  
  @media (max-width: 640px) {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }
`;

export const TabItem = styled.button`
  font-family: Ubuntu, sans-serif;
  font-size: 14px;
  color: #010000;
  text-transform: uppercase;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  opacity: 0.6;
  transition: opacity 0.2s ease;

  &.active {
    font-weight: bold;
    opacity: 1;
  }

  &:hover {
    opacity: 1;
  }
`;

export const TabContent = styled.div`
  margin-top: 24px;
  padding: 0;
  width: 100%;
  
  @media (max-width: 991px) {
    padding-left: 0;
    padding-right: 0;
  }
`;

export const TabHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  width: 100%;
`;

export const Title = styled.h2`
  font-size: 24px;
  margin: 0;
`;

export const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #0069d9;
  }
`;

export const TableContainer = styled.div`
  overflow-x: auto;
  margin-bottom: 24px;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #eee;
  }
  
  th {
    font-weight: bold;
    background-color: #f8f9fa;
  }
  
  tr:hover {
    background-color: #f8f9fa;
  }
`;

export const Loading = styled.div`
  text-align: center;
  padding: 24px;
  color: #6c757d;
`;

export const ErrorMessage = styled.div`
  color: #dc3545;
  background-color: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 24px;
`;

export const EmptyState = styled.div`
  text-align: center;
  padding: 48px 0;
  color: #6c757d;
`;

export const ActionButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  margin-right: 8px;
  cursor: pointer;
  
  &:hover {
    color: #0056b3;
  }
`;

export const FaEdit = EditIcon;
export const FaTrash = TrashIcon;
