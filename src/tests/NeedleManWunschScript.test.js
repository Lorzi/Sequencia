const NeedleManWunschScript = require('../algorithms/NeedleManWunschScript');


test('Param 1 -1 -2 check if a matrix is perfectly constructed', () => {
    const S1 = "CLOCK";
    const S2 = "BLOC";
    const Match = 1;
    const Mismatch = -1;
    const Gap = -2;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;
    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);
    console.log('subMatrix:', subMatrix);
    console.log('transfMatrix:', transfMatrix);
    expect(transfMatrix).toEqual([
        [0, -2, -4, -6, -8],
        [-2, -1, -3, -5, -5],
        [-4, -3, 0, -2, -4],
        [-6, -5, -2, 1, -1],
        [-8, -7, -4, -1, 2],
        [-10, -9, -6, -3, 0],
    ]);
})


test('Param 2 -1 -1, check score for full match sequence', () => {
    const S1 = "VVVVV";
    const S2 = "VVVVV";
    const Match = 2;
    const Mismatch = -1;
    const Gap = -1;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(10);
});

test('Param 1 -1 5, Positive gap value', () => {
    const S1 = "MARIA";
    const S2 = "WARIA";
    const Match = 1;
    const Mismatch = -1;
    const Gap = 5;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(50);
});

test('Param 2 -2 -3, check score for non equal in length sequences', () => {
    const S1 = "AZGZV";
    const S2 = "VEA";
    const Match = 2;
    const Mismatch = -2;
    const Gap = -3;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(-12);
});

test('Param 1 -1 -1, check score for whole different sequences', () => {
    const S1 = "BBBBBBB";
    const S2 = "DDDDDDD";
    const Match = 1;
    const Mismatch = -1;
    const Gap = -1;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(-7);
});

test('Param 1 -1 -1, check score for gap insertion in begin of sequence', () => {
    const S1 = "GCAG";
    const S2 = " GCAG";
    const Match = 1;
    const Mismatch = -1;
    const Gap = -1;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(3);
});

test('Param 1 -1 -1, check the score with an empty sequence', () => {
    const S1 = "ABCD";
    const S2 = "";
    const Match = 1;
    const Mismatch = -1;
    const Gap = -1;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(-4);
});

test('Param 1 -1 -1, check the score with two empty sequences', () => {
    const S1 = "";
    const S2 = "";
    const Match = 1;
    const Mismatch = -1;
    const Gap = -1;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(0);
});