import * as React from 'react';
import {useState} from "react";


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
            </select>
    </div>

        return (
            variantSelector
            //retourner ici les boutons Match MissMatch, Gap
        );

}
