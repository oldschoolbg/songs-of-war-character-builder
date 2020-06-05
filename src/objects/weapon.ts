import { Character } from "./character";
import { WeaponProperty, Melee, TwoHanded, HighCrit, Reach, Ranged, SlowToLoad, OneHanded, Light, LowAmmo, MoraleBoosting } from "../defs/weapon_property";
import { WeaponMatrix, WeaponStat } from "../defs/weapons_stat";

export class Weapon {
  constructor (
              key: string, 
              speed: number,
              strength: number) {
    this.Key = key;
    this.Speed = speed;
    this.Strength = strength;
    const stat_cost = WeaponMatrix.find((wm: WeaponStat) => wm.Speed === this.Speed && wm.Strength === this.Strength);
    if (!stat_cost) {
      throw new Error(`Invalid Weapon ${this.Key} - Speed and Strength provided are not a valid combination: speed: ${this.Speed}. strength: ${this.Strength}`);
    }
    this.BaseCost = stat_cost.PointsCost;
  };
  readonly Key: string;
  Speed: number;
  Strength: number;
  readonly BaseCost: number = 0;
  Properties: WeaponProperty[] = [];

  PointsCost() : number {
     return this.BaseCost + this.Properties.map((p: WeaponProperty) => p.Points).reduce((a, b) => a + b, 0);
  }

  AddEffect: (char: Character) => void = (char: Character) => {
    return;
  };
  RemoveEffect: (char: Character) => void = (char: Character) => {
    return;
  };

  setAddEffect(addEffect: (char: Character) => void): Weapon {
    this.AddEffect = addEffect;
    return this;
  }
  setRemoveEffect(removeEffect: (char: Character) => void): Weapon {
    this.RemoveEffect = removeEffect;
    return this;
  }

  AddProperty(weaponProperty: WeaponProperty, ...props: any[]) : Weapon {
    if (!weaponProperty.MultipleAllowed &&
        this.Properties.find((p: WeaponProperty) => p.Key === weaponProperty.Key)) {
          return this;
    }
    if (weaponProperty.Prerequisites.some((wp) => !this.Properties.find((p: WeaponProperty) => p.Key === wp.Key))) {
        throw new Error(`Cannot add ${weaponProperty.Key} as Weapon must already have ${weaponProperty.Prerequisites.map((p) => p.Key).join(', ')}.`);
      }
    let new_prop = weaponProperty.clone();
    this.Properties.push(new_prop);
    weaponProperty.AddEffect(this, new_prop, props);
    return this;
  }

  RemoveProperty(weaponProperty: WeaponProperty, ...props: any[]) : Weapon {
    // TODO: is this a prerequisite for other properties? If so, remove those as well or warn? TBC
    this.Properties = this.Properties.filter((p: WeaponProperty) => p.Key !== weaponProperty.Key);
    let new_prop = weaponProperty.clone();
    weaponProperty.RemoveEffect(this, new_prop, props);
    return this;
  }
}

export const Unarmed: Weapon = new Weapon("Unarmed", 3, 2);
export const Knife: Weapon = new Weapon("Knife", 3, 3);
export const OneHandedHandSwordAxeSpear = new Weapon("1 Handed Sword / Axe / Spear", 2, 5);
export const Staff: Weapon = new Weapon("Staff", 2, 5);
export const TwoHandedAxeHammerSword = new Weapon("2 Handed Axe / Hammer / Sword", 1, 7).AddProperty(TwoHanded).AddProperty(HighCrit);
export const TwoHandedPolearm = new Weapon("Two Handed Polearm", 1, 7).AddProperty(TwoHanded).AddProperty(Reach);
export const Longbow = new Weapon("Longbow", 1, 5).AddProperty(Ranged).AddProperty(Ranged).AddProperty(Ranged);
export const Shortbow = new Weapon("Shortbow", 1, 5).AddProperty(Ranged).AddProperty(Ranged);
export const Crossbow = new Weapon("Crossbow", 1, 6).AddProperty(Ranged).AddProperty(Ranged).AddProperty(SlowToLoad);
export const HandCrossbow = new Weapon("Crossbow", 1, 3).AddProperty(Ranged).AddProperty(OneHanded);
export const Dagger = new Weapon("Dagger", 3, 3).AddProperty(Light);
export const Whip = new Weapon("Whip", 2, 2).AddProperty(Light).AddProperty(Reach);
export const Javelin = new Weapon("Javelin", 1, 5).AddProperty(Ranged).AddProperty(OneHanded).AddProperty(LowAmmo, 3).AddProperty(Melee, WeaponMatrix.find((wp) => wp.Speed === 2 && wp.Strength === 4));
export const Sling = new Weapon("Sling", 1, 3).AddProperty(Ranged).AddProperty(Ranged).AddProperty(OneHanded);
export const ThrowingKnife = new Weapon("Throwing Knife", 1, 4).AddProperty(Ranged).AddProperty(OneHanded).AddProperty(LowAmmo, 4);
export const Pike = new Weapon("Pike", 2, 5).AddProperty(TwoHanded).AddProperty(Reach);
export const DoubleSword = new Weapon("Double Sword", 3, 5).AddProperty(TwoHanded);
export const WarBanner = new Weapon("War Banner", 2, 4).AddProperty(MoraleBoosting);