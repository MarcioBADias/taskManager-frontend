import styled from 'styled-components'
import { RiCheckboxCircleFill } from 'react-icons/ri'

export const ListContainer = styled.div`
  background-color: #4caf50;
  height: 100vh;
  margin-top: 1rem;
  padding: 1rem;
`

export const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  :hover {
    border: 3px solid #fff;
  }
`

export const ItenList = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 5px;
  margin-top: 0.5rem;
  background-color: ${({ highlight }) =>
    highlight ? 'rgba(255, 0, 0, 0.84)' : 'transparent'};

  svg {
    cursor: pointer;
    transition: transform 0.2s ease;
  }

  svg:hover {
    border: none;
    transform: scale(1.5);
  }
`
export const EditContainer = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
`

export const ListInput = styled.input`
  padding: 0.5rem;
  margin: 0.5rem;
`

export const CheckboxIcon = styled(RiCheckboxCircleFill)`
  width: 35px;
  height: 35px;
  cursor: pointer;
`
export const Popup = styled.div`
  color: red;
  background-color: #f9e6e6;
  padding: 10px;
  border: 1px solid red;
  margin-top: 10px;
  text-align: center;
`
