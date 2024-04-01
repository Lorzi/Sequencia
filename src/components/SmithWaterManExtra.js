import * as React from 'react';
import {useState} from "react";
import NeedlemanExtra from "./NeedlemanExtra";
import {NeedleManWunschScript} from "../NeedleManWunschScript";

export default function SmithWaterManExtra() {
    function CheckBox() {
        const [isChecked, setIsChecked] = useState(false);

        const handleCheckBoxChange = () => {
            setIsChecked(!isChecked);
        };

        return (
            <div>
                <select
                    value ={"oui"}
                    onChange = {(e) => {


                        console.log("juste voir si on rentre ici trop de fois =)")


                    }
                    }
                />
            </div>
        );
    }
    return(
        <div>
            <label>WATERMAN</label>
        </div>
    )
}
