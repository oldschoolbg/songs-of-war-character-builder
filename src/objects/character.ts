import { Move, Physicality, Dexterity, Constitution, Mind, Trait, Traits } from '../defs';
import { Mount, Mounts } from './mount';
import { Moveable, Keyed, IsCommander, Physical, Magicable } from '../interfaces';
import { MiscellaneousEquipment, MiscellaneousEquipments } from './miscellaneous_equipment';
import { Potion, Potions } from './potion';
import { Skill, Skills } from '../defs/skill';
import { Weapon, Weapons } from './weapon';
import { Armour } from './armour';
import { Shield } from './shield';
import { Elemental } from './magic';
import { CharacterClass, CharacterClasses } from '../defs/character_class';

/**
 * Default character has:
 * MOV = 4
 * PHY = 0
 * DEX = 0
 * CON = 1
 * MND = 0
 */
export class Character implements Moveable, Physical, Magicable, IsCommander {
  private constructor(characterClass: CharacterClass, isCommander?: boolean) {
    if (isCommander) {
      this.IsCommander = true;
    }
    this.SetCharacterClass(characterClass);
    this.Name = undefined;
    this._weapons = [
      Weapon.Unarmed()
    ];
  }

  Name: string | undefined;
  IsCommander: boolean = false;
  private _isRegular = false;
  get IsRegular(): boolean {
    return this._isRegular;
  }
  MOV: Move = new Move();
  PHY: Physicality = new Physicality();
  DEX: Dexterity = new Dexterity();
  CON: Constitution = new Constitution();
  MND: Mind = new Mind();

  private _characterClass = CharacterClass.Regular();
  get CharacterClass(): CharacterClass {
    return this._characterClass;
  }

  private _traits: Trait[] = [];
  get Traits(): Trait[] { return this._traits; };
  private _mount? : Mount;
  get Mount(): Mount | undefined { return this._mount; };
  private _elementals: Elemental[] = [];
  get Elementals(): Elemental[] {
    return this._elementals;
  }
  private _equipment: MiscellaneousEquipment[] = [];
  get Equipment(): MiscellaneousEquipment[] { return this._equipment; }
  private _potions: Potion[] = [];
  get Potions(): Potion[] { return this._potions; }
  private _skills: Skill[] = [];
  get Skills(): Skill[] { return this._skills; }
  private _weapons: Weapon[] = [];
  get Weapons(): Weapon[] { return this._weapons; }
  private _armour = Armour.None();
  get Armour(): Armour { return this._armour; }
  private _shield = Shield.None();
  get Shield(): Shield { return this._shield; }

  private _spellPoolLimit: number = 0;
  public get SpellPoolLimit(): number { return this._spellPoolLimit + this.MND.Value + 1; }
  private _spellcastingSlotsLimit: number = 0;
  public get SpellcastingSlotsLimit(): number { return this._spellcastingSlotsLimit; }
  private _spellcastingSchoolsLimit: number = 0;
  public get SpellcastingSchoolsLimit(): number { return this._spellcastingSchoolsLimit; }
  private _spellcastingSchools: any[] = [];
  get SpellCastingSchools(): any[] { return this._spellcastingSchools; }

  get PointsCost() : number {
    const mountCost : number = this.Mount !== undefined ? this.Mount.PointsCost : 0;
    return this.MOV.PointsCost
           + this.PHY.PointsCost
           + this.DEX.PointsCost
           + this.CON.PointsCost
           + this.MND.PointsCost
           + this.CharacterClass.PointsCost
           + this.Armour.PointsCost
           + this.Shield.PointsCost
           + this.Traits.map((t: Trait) => t.PointsCost).reduce((a, b) => a + b, 0)
           + this.Potions.map((p: Potion) => p.PointsCost).reduce((a, b) => a + b, 0)
           + this.Weapons.map((w: Weapon) => w.PointsCost).reduce((a, b) => a + b, 0)
           + this.Equipment.map((m: MiscellaneousEquipment) => m.PointsCost).reduce((a, b) => a + b, 0)
           + mountCost;
  }

  SetSpellcastingSchoolsLimit(to: number): Character {
    this._spellcastingSchoolsLimit = to;
    return this;
  }
  SetSpellcastingSlotsLimit(to: number): Character {
    this._spellcastingSlotsLimit = to;
    return this;
  }
  SetSpellPoolLimit(to: number): Character {
    this._spellPoolLimit = to;
    return this;
  }

  SetCharacterClass(characterClass: CharacterClass) : Character {
    if (this.IsCommander && characterClass.Key === CharacterClasses.Instinct) {
      throw new Error('You cannot set a Commander to the Instinct Character Class');
    }
    this._characterClass = characterClass;
    this._isRegular = this._characterClass.Key === CharacterClasses.Regular
    return this;
  }

  AddTrait(key: Traits) : Character {
    const trait = Trait.Options.find(t => t.Key === key);
    if (trait !== undefined) {
      this._traits.push(trait);
      trait.AddEffect(this);
    }
    return this;
  }

  RemoveTrait(key: Traits) : Character {
    const index = this._traits.findIndex((e: Keyed) => key === e.Key);
    if (index !== -1) {
      this._traits[index].RemoveEffect(this);
      this._traits.splice(index, 1);
    }
    return this;
  }

  HasTrait(key: Traits): boolean {
    return this._traits.find(t => t.Key === key) !== undefined;
  }

  AddEquipment(key: MiscellaneousEquipments) : Character {
    const equipment = MiscellaneousEquipment.Options.find(t => t.Key === key);
    if (equipment !== undefined) {
      if (equipment.Prerequisites.some((wp) => !this._equipment.find((p: Keyed) => p.Key === wp.Key))) {
        throw new Error(
          `Cannot add ${equipment.Key} as Character must have ${equipment.Prerequisites.map(
            (p) => p.Key,
          ).join(', ')}.`,
        );
      }
      this._equipment.push(equipment);
    }
    return this;
  }
  RemoveEquipment(key: MiscellaneousEquipments) : Character {
    const index = this._equipment.findIndex((e: Keyed) => key === e.Key);
    this._equipment.splice(index, 1);
    return this;
  }

  AddWeapon(key: Weapons | Weapon) : Character {
    let weapon: Weapon | undefined;
    if (key instanceof Weapon) {
      weapon = key as Weapon;
    } else {
      weapon = Weapon.Options.find(t => t.Key === key);
    }
    if (weapon !== undefined) {
      if (this._weapons.find(t => t.Key === Weapons.Unarmed)) {
        this._weapons = [];
      }
      this._weapons.push(weapon);
    }
    return this;
  }
  RemoveWeapon(key: Weapons) : Character {
    const index = this._weapons.findIndex((e: Keyed) => key === e.Key);
    if (index !== -1) {
      this._weapons.splice(index, 1);
      if (this._weapons.length === 0) {
        this._weapons = [
          Weapon.Unarmed()
        ];
      }
    }
    return this;
  }

  
  AddSkill(key: Skills) : Character {
    const skill = Skill.Options.find(t => t.Key === key);
    if (skill !== undefined) {
      if (skill.TraitPrerequisites.some((wp) => !this._traits.find((p: Keyed) => p.Key === wp.Key))) {
        throw new Error(
          `Cannot add ${skill.Key} as Character must have ${skill.TraitPrerequisites.map(
            (p) => p.Key,
          ).join(', ')}.`,
        );
      }
      if (skill.SkillPrerequisites.some((wp) => !this._skills.find((p: Keyed) => p.Key === wp.Key))) {
        throw new Error(
          `Cannot add ${skill.Key} as Character must have ${skill.SkillPrerequisites.map(
            (p) => p.Key,
          ).join(', ')}.`,
        );
      }
      if (skill.CharacterClassPrerequisites.some((wp) => this._characterClass.Key === wp.Key)) {
        throw new Error(
          `Cannot add ${skill.Key} as Character must be ${skill.CharacterClassPrerequisites.map(
            (p) => p.Key,
          ).join(', ')}.`,
        );
      }
      if (skill.OnlyCommander && !this.IsCommander) {
        throw new Error(`Cannot add ${skill.Key} as this Character is not a Commander`)
      }
      skill.AddEffect(this, skill);
      this._skills.push(skill);
    }
    return this;
  }
  RemoveSkill(key: Skills) : Character {
    const index = this._skills.findIndex((e: Keyed) => key === e.Key);
    if (index !== -1) {
      
      this._skills[index].RemoveEffect(this, this._skills[index]);
      this._skills.splice(index, 1);
    }
    return this;
  }

  AddMount(key: Mounts) : Character {
    const mount = Mount.Options.find(m => m.Key === key);
    if (mount !== undefined) {
      this._mount = mount;
    }
    return this;
  }
  RemoveMount() : Character {
    this._mount = undefined;
    return this;
  }

  AddElemental(elemental: Elemental): Character {
    this._elementals.push(elemental);
    return this;
  }
  RemoveElemental(elemental: Elemental): Character {
    const found = this._elementals.findIndex(e => e.Key === elemental.Key)
    if (found !== -1) {
      this._elementals.splice(found, 1);
    }
    return this;
  }

  AddArmour(armour: Armour) : Character {
    this._armour = armour;
    return this;
  }
  RemoveArmour  () : Character {
    this._armour = Armour.None();
    return this;
  }

  AddShield(shield: Shield) : Character {
    this._shield = shield;
    return this;
  }
  RemoveShield  () : Character {
    this._shield = Shield.None();
    return this;
  }

  AddPotion(key: Potions) : Character {
    const potion = Potion.Options.find(p => p.Key === key);
    if (potion !== undefined) {
      this._potions.push(potion);
    }
    return this;
  }

  RemovePotion(key: Potions) : Character {
    const index = this._potions.findIndex(p => p.Key === key);
    this._potions.splice(index, 1);
    return this;
  }

  static Leader(): Character {
    return new Character(CharacterClass.Regular(), true);
  }

  static Regular(): Character {
    return new Character(CharacterClass.Regular());
  }
  static Instinct(): Character {
    return new Character(CharacterClass.Instinct());
  }
}
