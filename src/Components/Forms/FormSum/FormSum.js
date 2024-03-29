import React, { useEffect, useRef, useState } from 'react';
import ButtonGreen from '../../Buttons/ButtonGreen/ButtonGreen';
import './FormSum.css';
import Numpad from '../../Numpad/Numpad';
import { useDispatch, useSelector } from 'react-redux';
import { inputRequestSum, withdrawalOfTheAmount } from '../../../reduxFold/actions/actionCreator';
import { parserBanknotes } from '../../../functions/functions';

function FormSum(props) {
    const { banknotes, initValueInput } = useSelector( state => state.serviceBanknotes);
    const dispatch = useDispatch();
    const [ value, setValue ] = useState(initValueInput);
    const currentRef = useRef(null);

    useEffect(() => {
        setValue('');
        // eslint-disable-next-line
    }, [banknotes])

    useEffect(() => {
        if (value === 0) {
            return;
        }
        const requiredSum = parseFloat(value) || 0;
        const { requiredBanknotes, remains } = parserBanknotes(requiredSum, banknotes);
        dispatch(inputRequestSum( requiredSum, requiredBanknotes, remains ));
        // eslint-disable-next-line
    }, [value])

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(withdrawalOfTheAmount());
    }
    
    const handleChange = (e) => {
        // eslint-disable-next-line
        const inputValue = e.target.value.replace(/[^0-9\.]/g, '');
        handleSetState(inputValue)
    }

    const addValue = (val) => {
        currentRef.current.focus();
        if (val === '.' && value.toString().includes(val)) {
            return;
        }
        const newValue = value.toString() + val;
        handleSetState(newValue);
    }

    const removeValue = () => {
        currentRef.current.focus();
        if (value.length === 0) {
            return;
        }
        handleSetState(value.slice(0, value.length - 1))
    }

    const handleSetState = (val) => {
        if (parseFloat(val) > 200000) {
            return setValue('200000');
        }
        setValue(val);
    }

    return (
        <div className="input-block">
            <form className='input-form' onSubmit={handleSubmit}>
                <div className="input-block-field">
                    <label htmlFor="field-sum" className='input-label'>
                        Ведите сумму для снятия
                    </label>
                    <label htmlFor="field-sumg" className='input-label-warnin'>
                        максимальное снятие за один раз 200 000
                    </label>
                    <input className='field-input-sum' name='field-sum' 
                    id='field-sum' value={value} onChange={handleChange}
                    placeholder='0' ref={currentRef} maxLength='12'/>
                </div>
                <ButtonGreen name={'выдача'} typeButton={'submit'}/>
            </form>
            <div className="numpad-block">
                <Numpad addValue={addValue} removeValue={removeValue}/>
            </div>
        </div>
    )
}

export default FormSum;

