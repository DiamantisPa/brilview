export function isInstantaneousUnit(unit) {
    return unit.toLowerCase().startsWith('hz/');
}

export function unitsConflict(unit1, unit2) {
    console.log('unitsConflict?', unit1, unit2);
    return (isInstantaneousUnit(unit1) !== isInstantaneousUnit(unit2));
}
