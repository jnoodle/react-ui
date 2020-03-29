import React, { useEffect, useMemo, useState } from 'react'
import useTheme from '../styles/use-theme'
import withDefaults from 'components/utils/with-defaults'
import { NormalTypes } from 'components/utils/prop-types'
import { getColors } from '../input/styles'

interface Props {
  value?: string
  initialValue?: string
  placeholder?: string
  status?: NormalTypes
  width?: string
  minHeight?: string
  disabled?: boolean
  readOnly?: boolean
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void
  className?: string
}

const defaultProps = {
  initialValue: '',
  status: 'default' as NormalTypes,
  width: 'initial',
  minHeight: '6.25rem',
  disabled: false,
  readOnly: false,
  className: '',
}

export type TextareaProps = Props & typeof defaultProps & React.TextareaHTMLAttributes<any>

const Textarea: React.FC<React.PropsWithChildren<TextareaProps>> = ({
  width, status, minHeight, disabled, readOnly, onFocus, onBlur,
  className, initialValue, onChange, value, placeholder, ...props
}) => {
  const theme = useTheme()
  const [selfValue, setSelfValue] = useState<string>(initialValue)
  const [hover, setHover] = useState<boolean>(false)
  const { color, borderColor, hoverBorder } = useMemo(
    () => getColors(theme.palette, status),
    [theme.palette, status],
  )
  
  const changeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (disabled || readOnly) return
    setSelfValue(event.target.value)
    onChange && onChange(event)
  }
  const focusHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setHover(true)
    onFocus && onFocus(e)
  }
  const blurHandler = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setHover(false)
    onBlur && onBlur(e)
  }
  
  useEffect(() => {
    if (value === undefined) return
    setSelfValue(value)
  }, [value])
  
  return (
    <div className={`wrapper ${hover ? 'hover' : ''} ${disabled ? 'disabled' : ''} ${className}`}>
      <textarea disabled={disabled} value={selfValue}
        placeholder={placeholder}
        readOnly={readOnly}
        onFocus={focusHandler}
        onBlur={blurHandler}
        onChange={changeHandler}
        {...props} />
      <style jsx>{`
        .wrapper {
          display: inline-flex;
          box-sizing: border-box;
          user-select: none;
          width: ${width};
          min-width: 12.5rem;
          max-width: 95vw;
          height: auto;
          border-radius: ${theme.layout.radius};
          border: 1px solid ${borderColor};
          color: ${color};
          transition: border 0.2s ease 0s, color 0.2s ease 0s;
        }
        
        .wrapper.hover {
          border-color: ${hoverBorder};
        }
        
        .wrapper.disabled {
          background-color: ${theme.palette.accents_1};
          border-color: ${theme.palette.accents_2};
          cursor: not-allowed;
        }
        
        textarea {
          background-color: transparent;
          box-shadow: none;
          display: block;
          font-family: ${theme.font.sans};
          font-size: .875rem;
          width: 100%;
          height: 100%;
          min-height: ${minHeight};
          resize: none;
          border: none;
          outline: none;
          padding: ${theme.layout.gapHalf};
        }
        
        .disabled > textarea {
          cursor: not-allowed;
        }
      `}</style>
    </div>
  )
}

export default withDefaults(Textarea, defaultProps)
