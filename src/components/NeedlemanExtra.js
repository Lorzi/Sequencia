import * as React from 'react';

/**
 * Allows you to give the component grouping together the variants associated with the choice of the Needleman-Wunsch algorithm
 * Return this compossant as a selector
 * @param chooseSelectedVariant
 * @returns {Element}
 * @constructor
 */
export default function NeedlemanExtra({chooseSelectedVariant}) {

    const variantSelector =
        <div>
            <select
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
                <option value = "default">default</option>
                <option value = "LCS">LCS</option>
                <option value = "wagnerf">Wagner-Fischer</option>
                <option value = "blosum">BLOSUM</option>
            </select>
    </div>

        return (
            variantSelector
        );

}
