import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function abs( val ) {
	  if(val < 0) return -val;
	  return val;
  }
  function pow( base, power ) {
    var result = 1;
    if ( power < 0 ) {
        return ( 1 / pow( base, -(power)) );
    }
    for ( var i = 0; i < power; i++ ) {
        result = result * base;
    }
    return result;
  }
  function kthrootofn( n, k ) {
	// Pascal-Raphson method:
	//  For x = nth root of k  => x^n = k => x^n - k = 0 = f(x) => [ g[uess] = g - (f(x)-k)/f'(x) ] => g = g - ( (x^(n) - k) / (n*x^(n-1)) )
	var guess = k / n;
	var loopCounter = 0;
	while(abs(pow(guess, n) - k) >= .0000001) {
		guess = guess - ((pow(guess, n) - k) / (n * pow(guess, n - 1)));
		loopCounter++;
		if(loopCounter > 100) break; // to prevent infinite loop
	}
	return guess;
  }
  function fact( n ) {
	var value = 1;
	var i;
	for (i = 0; i < n; i++) {
		value *= i;
	} 
	return value;
  }
  function stringWithCommas( x ) {
    var parts = x.split(".");
    return parts[0].replace(/\B(?=(\d{3})+(?=$))/g, ",") + (parts[1] ? "." + parts[1] : "");
  }

class Button extends React.Component {
  render() {
    return (
      <button className={this.props.className} onClick={this.props.onClick}>
        {this.props.children}
      </button>
    )
  }
}
class Calculator extends React.Component {
	
  constructor(props) {
    super(props)

    this.state = {
      operand: '0',
      previousOperand: '',
      operator: '',
	  operationSelected: false,
    }
  }

  handleOperandClick(i) {
    const { operand, operationSelected } = this.state
	
	if(operationSelected) {
      this.setState({
		previousOperand: operand,
		operationSelected: false,
        operand: String(i),
      });
	} else {
	  if((i !== '.')
		  || ((i === '.') && (operand.indexOf('.') === -1))) {
        this.setState({
          operand: operand === '0' ? String(i) : operand + String(i),
        });
	  }
	}
  }
  handleAllClearClick() {
    this.setState({
      operand: '0',
      previousOperand: '',
      operator: '',
	  operationSelected: false,
    });
  }
  handleSignClick() {
    const { operand } = this.state
	
      this.setState({
        operand: operand.charAt(0) === '-' ? operand.substr(1) : '-' + operand,
      })
  }
  handlePercentClick() {
    const { operand } = this.state
      this.setState({
        operand: String(parseFloat(operand) / 100),
      })
  }  
  handleOperatorClick(operation) {
    var { operator, previousOperand, operand } = this.state
	operand = parseFloat(operand)
	previousOperand = parseFloat(previousOperand)

	var doSet = true
	if(operator === '+') {
		operand = previousOperand + operand
	} else if(operator === '-') {
		operand = previousOperand - operand
	} else if(operator === 'X') {
		operand = previousOperand * operand
	} else if(operator === '/') {
		operand = previousOperand / operand
	} else if(operator === '^n') {
		operand = pow(previousOperand, operand)
	} else if(operator === 'nrt') {
		operand = kthrootofn(operand, previousOperand)
	} else if(operation === '=') {
		// Nothing to do
	} else if(operation === '^2') {
		operand = pow(operand, 2)
	} else if(operation === '^3') {
		operand = pow(operand, 3)
	} else if(operation === '1/x') {
		operand = 1 / operand
	} else if(operation === 'PI') {
		operand = 3.14159265
	} else if(operation === '10^x') {
		operand = pow(10, operand)
	} else if(operation === '!') {
		operand = fact(operand)
	} else if(operation === 'sqrt') {
		operand = kthrootofn(2, operand)
	} else if(operation === 'qbrt') {
		operand = kthrootofn(3, operand)
	} else {
	  doSet = false
      this.setState({
        operator: operation,
        operationSelected: true,
      })
	}
	if(doSet) {
	  if(operation === '='
		|| operation === '^2'
		|| operation === '^3'
		|| operation === '!'
		|| operation === '1/x'
		|| operation === 'sqrt'
		|| operation === 'qbrt'
		|| operation === '10^x'
		|| operation === 'PI'
		) {
        this.setState({
          operator: '',
          operationSelected: false,
		  operand: String(operand),
		  previousOperand: '',
        })
	  } else {
        this.setState({
          operator: operation,
          operationSelected: true,
		  operand: String(operand),
		  previousOperand: '',
        })
	  }
	}
  }
  
  renderInput() {
    const operand = this.state.operand;
    return <input id="result" type="text" readOnly className="button input" value={stringWithCommas(operand)}/>
  }

  render() {
    const title = 'Simple Calculator';

    return (
      <div>
        <div className="title">
		{title}
		</div>
        <div className="calc-row">
          {this.renderInput()}
        </div>
        <div className="calc-row">
		  <Button className="button unary" onClick={() => this.handleOperatorClick('sqrt')}>&#x221A;x</Button>
		  <Button className="button unary" onClick={() => this.handleOperatorClick('^2')}>x&#xb2;</Button>
		  <Button className="button" onClick={() => this.handleAllClearClick()}>AC</Button>
		  <Button className="button unary" onClick={() => this.handleSignClick()}>&#8723;</Button>
		  <Button className="button unary" onClick={() => this.handlePercentClick()}>%</Button>
		  <Button className="button binary" onClick={() => this.handleOperatorClick('/')}>&#8725;</Button>
        </div>
        <div className="calc-row">
		  <Button className="button unary" onClick={() => this.handleOperatorClick('qbrt')}>&#x221B;x</Button>
		  <Button className="button unary" onClick={() => this.handleOperatorClick('^3')}>x&#xb3;</Button>
		  <Button className="button buttonNumber" onClick={() => this.handleOperandClick(7)}>&#10108;</Button>
		  <Button className="button buttonNumber" onClick={() => this.handleOperandClick(8)}>&#10109;</Button>
		  <Button className="button buttonNumber" onClick={() => this.handleOperandClick(9)}>&#10110;</Button>
		  <Button className="button binary" onClick={() => this.handleOperatorClick('X')}>&#x2217;</Button>
        </div>
        <div className="calc-row">
		  <Button className="button binary" onClick={() => this.handleOperatorClick('nrt')}>n&#x221A;x</Button>
		  <Button className="button binary" onClick={() => this.handleOperatorClick('^n')}>x^n</Button>
		  <Button className="button buttonNumber" onClick={() => this.handleOperandClick(4)}>&#10105;</Button>
		  <Button className="button buttonNumber" onClick={() => this.handleOperandClick(5)}>&#10106;</Button>
		  <Button className="button buttonNumber" onClick={() => this.handleOperandClick(6)}>&#10107;</Button>
		  <Button className="button binary" onClick={() => this.handleOperatorClick('-')}>&#8722;</Button>
        </div>
        <div className="calc-row">
		  <Button className="button unary" onClick={() => this.handleOperatorClick('PI')}>&#8508;</Button>
		  <Button className="button unary" onClick={() => this.handleOperatorClick('!')}>x!</Button>
		  <Button className="button buttonNumber" onClick={() => this.handleOperandClick(1)}>&#10102;</Button>
		  <Button className="button buttonNumber" onClick={() => this.handleOperandClick(2)}>&#10103;</Button>
		  <Button className="button buttonNumber" onClick={() => this.handleOperandClick(3)}>&#10104;</Button>
		  <Button className="button binary" onClick={() => this.handleOperatorClick('+')}>+</Button>
        </div>
        <div className="calc-row">
		  <Button className="button unary" onClick={() => this.handleOperatorClick('10^x')}>10^x</Button>
		  <Button className="button unary" onClick={() => this.handleOperatorClick('1/x')}>1/x</Button>
		  <Button className="button buttonNumberZero button2" onClick={() => this.handleOperandClick(0)}>&#9471;</Button>
		  <Button className="button" onClick={() => this.handleOperandClick('.')}>.</Button>
		  <Button className="button unary" onClick={() => this.handleOperatorClick('=')}>=</Button>
        </div>
	    <pre>{JSON.stringify(this.state, null, 2)}</pre>		
      </div>
    );
  }
}
// ----------------------------------------
class SimpleCalculator extends React.Component {
  render() {
    return (
      <div className="calc">
        <Calculator />
      </div>
    );
  }
}
// ========================================
ReactDOM.render(
  <SimpleCalculator />,
  document.getElementById('root')
);
