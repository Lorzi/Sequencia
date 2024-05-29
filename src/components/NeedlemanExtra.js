import * as React from 'react';
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

/**
 * Allows you to give the component grouping together the variants associated with the choice of the Needleman-Wunsch algorithm
 * Return this component as a selector
 * @param chooseSelectedVariant
 * @returns {Element}
 * @constructor
 */
export default function NeedlemanExtra({chooseSelectedVariant}) {

    const variantSelector =
        <div>
            <FormControl fullWidth>
                <InputLabel id="needleman-extra">Variant</InputLabel>
                <Select
                    label = "Variante"
                    variant="outlined"
                    style={{
                        width: '300px',
                        height: '56px',
                        padding: '10px',
                        outline: 'none',
                        transition: 'box-shadow 0.3s',
                    }}
                    onChange = {(e) => {

                        chooseSelectedVariant(e.target.value)

                        const selectedValue = e.target.value
                        if(selectedValue === "default"){

                            console.log("Variante par defaut choisie")
                        }
                        if(selectedValue === "LCS"){

                            console.log("Variante LCS choisie")
                        }

                    }
                    }

                >
                    <MenuItem  value = "default">Default</MenuItem >
                    <MenuItem  value = "LCS">LCS</MenuItem >
                    <MenuItem  value = "wagnerf">Wagner-Fischer</MenuItem >
                </Select>
            </FormControl>
    </div>

        return (
            variantSelector
        );

}
