import React, {useEffect} from 'react';
import pages from "./pages.module.css";
import param from "./documentation_images/param.png";
import pathsChoose from "./documentation_images/pathsChoose.png";
import matrix from "./documentation_images/matrix.png";
import resultBox from "./documentation_images/resultBox.png";
import tables from "./documentation_images/tables.png";
import mode1 from "./documentation_images/mode1.png";
import mode1Help from "./documentation_images/mode1Help.png";
import mode2 from "./documentation_images/mode2.png";
import mode2Help from "./documentation_images/mode2Help.png";
import blosum from "./documentation_images/blosum.png";



/**
 * This code comes/inspired from a solution of windows resize from stackOverflow Source : https://stackoverflow.com/questions/73600399/why-resized-function-is-always-trigger-when-resizing-browser-window-even-if-the
 * Allows the resize of the windows and adapt the page with it
 */
export const adjustedZoomValue = () => {
    document.body.style.zoom = (window.innerWidth / 1920);
};

/**
 * This code comes/inspired from a solution of windows resize from stackOverflow Source : https://stackoverflow.com/questions/73600399/why-resized-function-is-always-trigger-when-resizing-browser-window-even-if-the
 * Handling window resize and adjust zoom.
 */
export const useAdjustedZoom = () => {
    useEffect(() => {
        adjustedZoomValue();
        window.addEventListener('resize', adjustedZoomValue);
        return () => {
            window.removeEventListener('resize', adjustedZoomValue);
        };
    }, []);
};

/**
 * Help documentation for the normal mode
 *  The documentation wrote in this file is inspired by . Durbin, S. R. Eddy, A. Krogh, and G. Mitchison. Biological Sequence Analysis :
 *  Probabilistic Models of Proteins and Nucleic Acids. Cambridge University Press,
 *  1998
 *  and from many sources in the report linked to this project -> Please check the report.
 * @type {React.JSX.Element}
 */
export const helpNormalText = (
    <div className={pages.pageTextMargin}>
        <div>
            <label className={pages.helpTitle}>Normal Mode</label>
        </div>
        <p className={pages.fontNormalTextNonCenter}>
            Normal mode allows you to view a sequence alignment. <br/>
            Just enter the two sequences to align in the fields, choose the algorithm and variant and fill in the parameters.
        </p>
        <div>
            <label className={pages.helpSubTitle}>Explanations of the graphical components.</label>
        </div>
        <div>
            <label className={pages.helpSubSubTitle}>Parameters</label>
        </div>
        <p>
            <img src={param} alt="Sequencia" style={{ width: '60%'}}/>
        </p>
        <p className={pages.fontNormalTextNonCenter}>
            Several fields are available.<br/>
            The "Sequence" fields allow you to enter the sequences you want to align.<br/>
            The "Algorithm" field allows you to choose between 2 sequence alignment algorithms: Needleman - Wunsch and Smith - Waterman.<br/>
            The "Variant" field is only available for Needleman – Wunsch, it allows you to choose between 3 variants "default", "LCS", "Wagner-Fischer"<br/>
            The match, mismatch, and gap fields are used to set the value for them.<br/>
            The "Reset value" button is used to reset the default match, mismatch and gap values.<br/>
            The "Compute limit" box allows you to set a limit for calculating optimal paths. Sometimes this number of paths can go beyond hundreds of thousands and can lead to performance issues. (Caution when editing this value !)<br/>
        </p>
        <div>
            <label className={pages.helpSubSubTitle}>Box of arrows</label>
        </div>
        <p>
            <img src={pathsChoose} alt="Sequencia" style={{ width: '25%'}}/>
        </p>
        <p className={pages.fontNormalTextNonCenter}>
            The arrows allow you to navigate between the optimal set of paths and select a specific one.
        </p>
        <div>
            <label className={pages.helpSubSubTitle}>Result box</label>
        </div>
        <p>
            <img src={resultBox} alt="Sequencia" style={{ width: '35%'}}/>
        </p>
        <p className={pages.fontNormalTextNonCenter}>
            This box displays the result of the alignment as well as the optimal score.
        </p>
        <div>
            <label className={pages.helpSubSubTitle}>Matrix</label>
        </div>
        <p>
            <img src={matrix} alt="Sequencia" style={{ width: '35%'}}/>
        </p>
        <p className={pages.fontNormalTextNonCenter}>
            The first matrix with a blue line represents the score matrix with an optimal path chosen (in blue)<br/>
            The second matrix with an orange line represents the "arrow" matrix comprising the set of optimal paths starting from the last point.
        </p>
        <div>
            <label className={pages.helpSubSubTitle}>Tables</label>
        </div>
        <p>
            <img src={tables} alt="Sequencia" style={{ width: '60%'}}/>
        </p>
        <p className={pages.fontNormalTextNonCenter}>
            The table on the left provides a list of all the optimal paths.<br/>
            The table on the right allows you to have a whole bunch of details about the optimal path currently selected.
        </p>
        <div>
            <label className={pages.helpSubTitle}>Description of the algorithms.</label>
        </div>
        <p className={pages.fontNormalTextNonCenter}>
            The tool contains two algorithms that are currently available:<br/>
            -	Needleman–Wunsch: Performs maximum global alignment.<br/>
            -	Smith–Waterman: Performs minimal local alignment
        </p>
        <div>
            <label className={pages.helpSubTitle}>Description of the variants.</label>
        </div>
        <p className={pages.fontNormalTextNonCenter}>
            These variants have been adapted to the Needleman Wunsch algorithm with very little code modification.<br/>
            -	LCS: Allows you to find the longest common sequence between two strings of characters.<br/>
            -	Wagner-fischer: Algorithm for calculating editing distance.

        </p>




    </div>
);

/**
 * Help Documentation for the gamemode
 *  The documentation wrote in this file is inspired by . Durbin, S. R. Eddy, A. Krogh, and G. Mitchison. Biological Sequence Analysis :
 *  Probabilistic Models of Proteins and Nucleic Acids. Cambridge University Press,
 *  1998
 *  and from many sources in the report linked to this project -> Please check the report.
 * @type {React.JSX.Element}
 */
export const helpGameText = (
    <div className={pages.pageTextMargin}>
        <div>
            <label className={pages.helpTitle}>Game Mode</label>
        </div>
        <p className={pages.fontNormalTextNonCenter}>
            This game mode is based on the Needleman-Wunsch's algorithm.<br/>
            For both games, the user must enter their sequences and settings.<br/>
            A restart button is available to restart the game at any time.
        </p>
        <div>
            <label className={pages.helpSubSubTitle}>Mode 1: Filling in the score matrix</label>
        </div>
        <p>
            <img src={mode1} alt="Sequencia" style={{ width: '50%'}}/>
        </p>
        <p className={pages.fontNormalTextNonCenter}>
            The game mode of filling matrix score consists of finding (by following the dynamic movement of the calculation of this matrix) the score of each square of the score matrix.<br/>
            The blue box corresponds to the box whose score must be determined. Simply fill in the field circled in red and submit the answer to try.<br/>
            The game stops when the matrix is completely processed. If you fail the box will turn red, otherwise it will remain white, which means you haven't made any mistakes.<br/>
            At the end of the game, you will have your accuracy rate as well as your number of correct and wrong answers.<br/>
            At the bottom of the page, you'll find a tool to help you better understand how to calculate these values:<br/>
        </p>
        <p>
            <img src={mode1Help} alt="Sequencia" style={{ width: '30%'}}/>
        </p>
        <p className={pages.fontNormalTextNonCenter}>
            (Help is only displayed from the second line)<br/>
            <br/>

            Steps to calculate these values:<br/>
            The first step is to fill in the first row. This is the cumulative sum of the gaps at each iteration.<br/>
            Then, we calculate 3 values: "TOP VALUE", "DIAGONAL VALUE" and "LEFT VALUE" according to the position of the square.<br/>
            - TOP VALUE is the value above our searched box + the value of the gap.<br/>
            - HORIZONTAL VALUE is the value that is diagonal to our searched box + the value of the match if the 2 associated characters of the sequences are equal or the value of the mismatch otherwise.<br/>
            - LEFT VALUE is the value to the left of our searched box + the value of the gap.<br/>
            The last step is to take the maximum value among these 3 values.
        </p>
        <div>
            <label className={pages.helpSubSubTitle}>Mode 2: Optimal path discovery</label>
        </div>
        <p>
            <img src={mode2} alt="Sequencia" style={{ width: '50%'}}/>
        </p>
        <p className={pages.fontNormalTextNonCenter}>
            The goal of this game mode is to find an optimal path to this score matrix. Just click on one of the blue boxes that you pass is the right solution to move forward.<br/> The game stops when you get to the first square.<br/>
            To find an optimal path,<br/>
            The method consists of subtracting the value of the current square for each possible square:<br/><br/>

            -	Subtract from the top box, in order for us to accept this top box as a solution, the result of the subtraction (current box - top box) must be equal to the gap<br/>

            -	Subtract from the diagonal square (top left), in order for us to accept this diagonal square as a solution, the result of the subtraction (current square - diagonal square) must be equal to the match (and there is a match) or the mismatch (and there is a mismatch).<br/>

            -	Subtract from the box on the left, in order for us to accept this box on the left as a solution, the result of the subtraction (current box - box on the left) must be equal to the gap.<br/>

            <br/>
            The last step is to click on a box that is "accepted" after our calculations.
        </p>
        <p>
            <img src={mode2Help} alt="Sequencia" style={{ width: '30%'}}/>
        </p>
        <p className={pages.fontNormalTextNonCenter}>
            A small calculator has been developed at the bottom of the game page to better visualize the calculation that allows you to determine which square is accepted or not.
        </p>
    </div>
);

/**
 * Help Documentation for the BLOSUM mode
 *  The documentation wrote in this file is inspired by . Durbin, S. R. Eddy, A. Krogh, and G. Mitchison. Biological Sequence Analysis :
 *  Probabilistic Models of Proteins and Nucleic Acids. Cambridge University Press,
 *  1998
 *  and from many sources in the report linked to this project -> Please check the report.
 * @type {React.JSX.Element}
 */
export const helpBlosumText = (
    <div className={pages.pageTextMargin}>
        <div>
            <label className={pages.helpTitle}>Blosum Mode</label>
        </div>
        <p className={pages.fontNormalTextNonCenter}>
            This blosum mode uses the Needleman-Wunsch algorithm. <br/>
            The "blosum" mode allows you to calculate a score matrix based on blosum62's match/mismatch score if no file is uploaded by the user.<br/>
            If a custom file is loaded, then the values will come from that custom file.<br/>
            The interface is very basic, there are two sequences to fill and a gap value to fill.
        </p>

        <p>
            <img src={blosum} alt="Sequencia" style={{ width: '50%'}}/>
        </p>

    </div>
);

/**
 * Introduction
 *  The documentation wrote in this file is inspired by . Durbin, S. R. Eddy, A. Krogh, and G. Mitchison. Biological Sequence Analysis :
 *  Probabilistic Models of Proteins and Nucleic Acids. Cambridge University Press,
 *  1998
 *  and from many sources in the report linked to this project -> Please check the report.
 * @type {React.JSX.Element}
 */
export const introductionText = (
    <div className={pages.pageTextMargin}>
        <div>
            <label className={pages.helpTitle}>Introduction</label>
        </div>
        <p className={pages.fontNormalTextNonCenter}>
            <strong>Sequence alignment visualization tool created by BOIVIN Lorentz as part of the Master 1 project at the University of Mons.<br/>
            Project supervised by Mr. Tom Mens.</strong>
        </p>
        <p className={pages.fontNormalTextNonCenter}>
            One of the main features of this tool is to align DNA and protein sequences in the field of biology and bioinformatics.<br/>
            However, it also allows you to work on strings.<br/>
            This aims to make the sequence alignment more understandable and visual.<br/>
            Different modes are accessible such as normal mode, game mode, and "Blosum" mode.<br/>
            In this documentation, each mode will be explained with textual information and images.<br/><br/>

            Sources for the algorithms and explanations : < a href="https://1drv.ms/b/s!ApdrD7C8eYGn_RBxTBgH_jRE8oyU?e=yOvmGy" > Report of the project < /a >.<br/><br/>

            Link of the repository :  < a href="https://github.com/Lorzi/Sequencia"> https://github.com/Lorzi/Sequencia< /a >.<br/>
            Contact : Lorentz.BOIVIN@umons.student.ac.be


        </p>

        <div>
            <label className={pages.helpTitle}>Sequence Alignment</label>
        </div>
        <p className={pages.fontNormalTextNonCenter}>
            Before going any further in the explanations, it is necessary to understand what a sequence alignment is as well as the components associated with it.<br/>
            A sequence alignment is a comparison of 2 sequences (<strong>Sequence 1</strong> and <strong>Sequence 2</strong>) which are usually DNA sequences and protein sequences. This tool also allows you to include strings.<br/>
            What is the purpose of an alignment? An alignment is used to highlight similarities between the 2 sequences and aims to maximize them by adding gaps for example.<br/><br/>
            To highlight the similarities, we need 3 parameters:<br/>
            -	<strong>Match</strong>: A match means that the two elements being compared, at a certain position, are identical. When we have a match, we assign a positive value. A match is an event that we promote.<br/>
            -	<strong>Mismatch</strong>: A mismatch means that the two elements being compared at a certain position are not identical. When we have a mismatch, we assign a negative value. It's an event that we want to avoid.<br/>
            -	<strong>Gap</strong>: A gap is a gap that we will introduce in one of the sequences to try to maximize the number of games. Most of the time the value of the gap is negative.<br/><br/>
            An alignment is done in two stages:<br/>
            -	Score matrix <strong>calculation</strong>: A score matrix is calculated dynamically and represents the scores obtained at each position in the matrix starting from the beginning.<br/>
            -	Calculation of an <strong>optimal path</strong>: An optimal path is calculated using the score matrix, the goal is to return from the best score found to the beginning of the matrix (also called traceback).<br/>
            After these steps, you will therefore obtain an optimal alignment.<br/>
            These steps are done automatically by the tool, but the game section allows for better visualization and understanding of how the matrix and optimal paths are calculated.<br/>

        </p>

    </div>
);

