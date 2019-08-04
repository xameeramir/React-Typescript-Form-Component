import * as React from 'react';
import { IErrors, IValues, IFormContext, FormContext } from './Form';

/* The available editors for the field */
type Editor = 'textbox' | 'multilinetextbox' | 'dropdown';

// introduce a prop to Field to allow consumers to add validation
export interface IValidation {
    rule: (values: IValues, fieldName: string, args: any) => string;
    args?: any;
}

export interface IFieldProps {
    /* The unique field name */
    id: string;

    /* The label text for the field */
    label?: string;

    /* The editor for the field */
    editor?: Editor;

    /* The drop down items for the field */
    options?: string[];

    /* The field value */
    value?: any;

    /* The field validator function and argument */
    validation?: IValidation;
}

export const Field: React.FunctionComponent<IFieldProps> = (
    { id, label, editor, options, value }
) => {


    const handleOnFieldChange: any = (
        context: IFormContext | undefined,
        id: string,
        event: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement> | React.FormEvent<HTMLSelectElement>
    ) => {
        context ? context.setValues({ [id]: event.currentTarget.value }) : console.log(`Context is ${context}`);
    }

    const handleOnBlur: any = (context: IFormContext, id: string) => {
        debugger
        context.validate(id);
    }

    /**
   * Gets the validation error for the field
   * @param {IErrors} errors - All the errors from the form
   * @returns {string[]} - The validation error
   */
    const getError = (errors: IErrors | undefined): string => (errors ? errors[id] : "");

    /**
    * Gets the inline styles for editor
    * @param {IErrors} errors - All the errors from the form
    * @returns {any} - The style object
    */
    const getEditorStyle = (errors: IErrors): any =>
        getError(errors) ? { borderColor: 'red' } : {};



    return (
        <FormContext.Consumer>
            {(context: IFormContext | undefined) => (
                <div className='form-group'>
                    {label && <label htmlFor={id}>{label}</label>}

                    {editor!.toLocaleLowerCase() === 'textbox' && (<input
                        id={id}
                        type='text'
                        value={value}
                        onChange={
                            (e: React.FormEvent<HTMLInputElement>) => handleOnFieldChange(context, id, e)
                        }
                        onBlur={
                            (e: React.FormEvent<HTMLInputElement>) => handleOnBlur(context, id)
                            /* TODO: validate field value */
                        }
                        style={context && getEditorStyle(context.errors)}
                        className='form-control'
                    />)}

                    {editor!.toLocaleLowerCase() === 'multilinetextbox' && (<textarea
                        id={id}
                        value={value}
                        onChange={
                            (e: React.FormEvent<HTMLTextAreaElement>) => handleOnFieldChange(context, id, e)
                        }
                        onBlur={
                            (e: React.FormEvent<HTMLTextAreaElement>) => handleOnBlur(context, id)
                            /* TODO: validate field value */
                        }
                        style={context && getEditorStyle(context.errors)}
                        className='form-control'
                    />)}

                    {editor!.toLocaleLowerCase() === 'dropdown' && (<select
                        id={id}
                        name={id}
                        value={value}
                        onChange={
                            (e: React.FormEvent<HTMLSelectElement>) => handleOnFieldChange(context, id, e)
                        }
                        onBlur={
                            (e: React.FormEvent<HTMLSelectElement>) => handleOnBlur(context, id)
                            /* TODO: validate field value */
                        }
                        style={context && getEditorStyle(context.errors)}
                        className='form-control'>
                        {options && options.map(option => (
                            <option key={option} value={option}> {option} </option>
                        ))}
                    </select>)}
                    {context && getError(context.errors) &&
                        <div style={{ color: 'red', fontSize: '80%' }}>{getError(context.errors)}</div>}
                </div>
            )}
        </FormContext.Consumer>
    );
};

Field.defaultProps = {
    editor: 'textbox'
};