import { EquipmentProperties } from '../defs';
import {
  Weapon,
} from '../objects/weapon';

test('Unarmed cost', () => {
  expect(Weapon.Unarmed().PointsCost).toBe(0);
});
test('Weapon immutability check', () => {
  const weaponOne = Weapon.Knife();
  const weaponTwo = Weapon.Knife();
  weaponOne.AdjustSpeed(1);
  expect(weaponOne.Speed).toBe(weaponTwo.Speed + 1);
});
test('Knife cost', () => {
  expect(Weapon.Knife().PointsCost).toBe(3);
});
test('Sword cost', () => {
  expect(Weapon.OneHandedSword().PointsCost).toBe(5);
});
test('Axe cost', () => {
  expect(Weapon.OneHandedAxe().PointsCost).toBe(5);
});
test('Spear cost', () => {
  expect(Weapon.OneHandedSpear().PointsCost).toBe(5);
});
test('Staff cost', () => {
  expect(Weapon.Staff().PointsCost).toBe(5);
});
test('Two handed axe cost', () => {
  expect(Weapon.TwoHandedAxe().PointsCost).toBe(7);
});
test('Two handed hammer cost', () => {
  expect(Weapon.TwoHandedHammer().PointsCost).toBe(7);
});
test('Two handed sword cost', () => {
  expect(Weapon.TwoHandedSword().PointsCost).toBe(7);
});
test('Two handed polearm cost', () => {
  expect(Weapon.TwoHandedPolearm().PointsCost).toBe(9);
});
test('Longbow cost', () => {
  expect(Weapon.Longbow().PointsCost).toBe(7);
});
test('Shortbow cost', () => {
  expect(Weapon.Shortbow().PointsCost).toBe(5);
});
test('Crossbow cost', () => {
  expect(Weapon.Crossbow().PointsCost).toBe(6);
});
test('Hand Crossbow cost', () => {
  expect(Weapon.HandCrossbow().PointsCost).toBe(2);
});
test('Dagger cost', () => {
  expect(Weapon.Dagger().PointsCost).toBe(5);
});
test('Dual Weild Daggers cost', () => {
  expect(Weapon.DualWieldDaggers().PointsCost).toBe(8);
});
test('Whip cost', () => {
  expect(Weapon.Whip().PointsCost).toBe(2);
});
test('Javelin cost', () => {
  expect(Weapon.Javelin().PointsCost).toBe(7);
});
test('Sling cost', () => {
  expect(Weapon.Sling().PointsCost).toBe(4);
});
test('Throwing Knife cost', () => {
  expect(Weapon.ThrowingKnife().PointsCost).toBe(4);
});
test('Pike cost', () => {
  expect(Weapon.Pike().PointsCost).toBe(7);
});
test('Double Sword cost', () => {
  expect(Weapon.DoubleSword().PointsCost).toBe(7);
});
test('War Banner cost', () => {
  expect(Weapon.WarBanner().PointsCost).toBe(5);
});


test('melee weapon range', () => {
  expect(Weapon.Knife().Range).toEqual('Melee');
});

test('reach weapon range', () => {
  expect(Weapon.TwoHandedPolearm().Range).toEqual('Melee (1")');
});
test('long reach weapon range', () => {
  expect(Weapon.TwoHandedPolearm().AddProperty(EquipmentProperties.Reach).Range).toEqual('Melee (2")');
});


test('range weapon range', () => {
  expect(Weapon.HandCrossbow().Range).toEqual('3"');
});
test('long range weapon range', () => {
  expect(Weapon.Longbow().Range).toEqual('9"');
});