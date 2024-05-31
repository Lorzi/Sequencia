const NeedleManWunschScript = require('./NeedleManWunschScript');

test('Param 1 -1 -2 check if a matrix is perfectly constructed', () => {
    const S1 = "GATTACA";
    const S2 = "GCATGCU";
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
        [0, -2, -4, -6, -8, -10, -12, -14],
        [-2, 1, -1, -3, -5, -7, -9, -11],
        [-4, -1, 0, 0, -2, -4, -6, -8],
        [-6, -3, -2, -1, 1, -1, -3, -5],
        [-8, -5, -4, -3, 0, 0, -2, -4],
        [-10, -7, -6, -3, -2, -1, -1, -3],
        [-12, -9, -6, -5, -4, -3, 0, -2],
        [-14, -11, -8, -5, -6, -5, -2, -1]
    ]);
})


test('Param 2 -1 -1, check score for full match sequence', () => {
    const S1 = "AAAA";
    const S2 = "AAAA";
    const Match = 2;
    const Mismatch = -1;
    const Gap = -1;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(8); // 4 matches * 2 = 8
});

test('Param 1 -1 -2, check score for 1 mismatchs and 3 matchs', () => {
    const S1 = "GATT";
    const S2 = "GACT";
    const Match = 1;
    const Mismatch = -1;
    const Gap = -2;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(2); // 2 matches * 1 - 1 mismatch * -1 = 2
});

test('Param 2 -2 -3, check score for non equal in length sequences', () => {
    const S1 = "ACGT";
    const S2 = "ACG";
    const Match = 2;
    const Mismatch = -2;
    const Gap = -3;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(3); // 3 matches * 2 - 1 gap * -3 = 3
});

test('Param 1 -1 -1, check score for whole different sequences', () => {
    const S1 = "AAAA";
    const S2 = "TTTT";
    const Match = 1;
    const Mismatch = -1;
    const Gap = -1;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(-4); // 4 mismatches * -1 = -4
});

test('Param 1 -1 -1, check score for gap insertion in begin of sequence', () => {
    const S1 = "GATTACA";
    const S2 = " GATTACA";
    const Match = 1;
    const Mismatch = -1;
    const Gap = -1;
    const operation_mm = 0;
    const blosumCheck = false;
    const blosumCustom = null;

    const [subMatrix, transfMatrix] = NeedleManWunschScript(S1, S2, Match, Mismatch, Gap, operation_mm, blosumCheck, blosumCustom);

    const lastRow = transfMatrix[transfMatrix.length - 1];
    const score = lastRow[lastRow.length - 1];

    expect(score).toEqual(6); // 6 matches * 1 - 1 gap * -1 = 6
});