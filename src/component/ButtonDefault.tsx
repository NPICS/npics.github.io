import React from 'react';
import styled from 'styled-components';
import { flex } from './styled'
interface Iprops {
  width?: string,
  height?: string,
  fontSize?: string,
  text?: string,
  border?: string,
  types?: string,
  disabled?: boolean,
  children: string | any,
  onClick?: Function | any
}

const StyledButton = styled.button<Iprops>`
  &:hover {
    background-color: ${(props => props.types === 'normal'? "#FF490F" : '')};
    background: ${(props => props.types === 'second'? "#FFFFFF" : '')};
    box-shadow: ${(props => props.types === 'second'? "0px 0px 20px rgba(0, 0, 0, 0.1)" : '')};
    border: ${(props => props.types === 'second'? "0" : '')};
  }
  &:disabled {
    background-color: #999;
  }
  background: ${(props => {
     switch (props.types) {
      case 'one':
       return 'rgba(255,255,255,.1)';
      case 'two':
       return 'transparent';
      case 'three':
       return 'linear-gradient(284.2deg, #FF0000 0%, #FEB240 101.06%);';
      case 'four':
       return 'rgba(255, 255, 255, 1)';
      case 'disabled':
       return '#999';
      case 'normal':
       return '#000';
      case 'second':
       return '#fff';
      default:
        return null;
    }
  })};
   border: ${(props => {
     switch (props.types) {
      case 'one':
       return '0';
      case 'two':
       return '.02rem solid rgba(255,255,255,.2)';
      case 'three':
       return '0';
      case 'four':
       return '.01rem solid rgba(255, 255, 255, 3)';
      case 'disabled':
       return '0';
      case 'normal':
       return '0';
      case 'second':
       return '1px solid rgba(0,0,0,.2)';
      default:
        return null;
    }
  })};
  background: ${(props => props.disabled ? '#999' : '')};
  color: ${(props => props.color)};
  width: ${(props => props.width)};
  height: ${(props => props.height)};
  font-size: ${(props => props.fontSize)};
  border-radius: 10px;
  font-family: 'PingFang HK';
  font-style: normal;
  font-weight: 600;
  font-size: .2rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  ${flex}
`

function ButtonDefault(props:Iprops) {

  const onClick = () => {
    if(props.disabled) return
    return props.onClick()
  }

  return (<StyledButton 
    {...props}
    onClick={onClick}
    disabled={props.disabled}
  >
      {props.children}
  </StyledButton>
  );
}
ButtonDefault.defaultProps = {
  border: 0,
  width: '3rem',
  height: '.66rem',
  text: 'button',
  fontSize: '16px',
  types: 'one',
  color: '#fff',
  disabled: false,
}
 
export default ButtonDefault
