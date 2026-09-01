import Button from '../Button/Button'
import Display from '../Display/Display'
import { useCalculator } from '../../hooks/useCalculator'
import styles from './Calculator.module.css'

const operationLabels: Record<string, string> = {
  add: '+',
  subtract: '−',
  multiply: '×',
  divide: '÷',
  power: '^',
  sqrt: '√',
  percentage: '%',
}

export const Calculator = () => {
  const {
    display,
    previousValue,
    operation,
    error,
    isLoading,
    inputDigit,
    inputDecimal,
    chooseOperation,
    clear,
    compute,
    toggleSign,
    inputPercent,
  } = useCalculator()

  const operationSymbol = operation ? operationLabels[operation] : null

  return (
    <div className={styles.calculator}>
      <div className={styles.displayWrapper}>
        <Display
          value={display}
          previousValue={previousValue}
          operation={operationSymbol}
          error={error}
          isLoading={isLoading}
        />
      </div>

      <div className={styles.keypad}>
        <Button label="C" onClick={clear} variant="danger" className={styles.c} />
        <Button label="√" onClick={() => chooseOperation('sqrt')} variant="secondary" className={styles.sqrt} />
        <Button label="%" onClick={inputPercent} variant="secondary" className={styles.pct} />
        <Button label="±" onClick={toggleSign} variant="secondary" className={styles.pm} />

        <Button label="7" onClick={() => inputDigit('7')} className={styles.n7} />
        <Button label="8" onClick={() => inputDigit('8')} className={styles.n8} />
        <Button label="9" onClick={() => inputDigit('9')} className={styles.n9} />
        <Button label="×" onClick={() => chooseOperation('multiply')} variant="primary" className={styles.mul} />

        <Button label="4" onClick={() => inputDigit('4')} className={styles.n4} />
        <Button label="5" onClick={() => inputDigit('5')} className={styles.n5} />
        <Button label="6" onClick={() => inputDigit('6')} className={styles.n6} />
        <Button label="−" onClick={() => chooseOperation('subtract')} variant="primary" className={styles.sub} />

        <Button label="1" onClick={() => inputDigit('1')} className={styles.n1} />
        <Button label="2" onClick={() => inputDigit('2')} className={styles.n2} />
        <Button label="3" onClick={() => inputDigit('3')} className={styles.n3} />
        <Button label="+" onClick={() => chooseOperation('add')} variant="primary" className={styles.add} />

        <Button label="0" onClick={() => inputDigit('0')} className={styles.n0} />
        <Button label="." onClick={inputDecimal} className={styles.dot} />
        <Button label="^" onClick={() => chooseOperation('power')} variant="primary" className={styles.pow} />
        <Button label="÷" onClick={() => chooseOperation('divide')} variant="primary" className={styles.div} />

        <Button label="=" onClick={compute} variant="primary" className={styles.eq} />
      </div>
    </div>
  )
}

export default Calculator
