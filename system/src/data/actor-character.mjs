import LadyBlackbirdActorBase from "./base-actor.mjs";

export default class LadyBlackbirdCharacter extends LadyBlackbirdActorBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.description = new fields.StringField({
      required: true,
      blank: true,
    });

    return schema;
  }

  prepareDerivedData() {}

  getRollData() {
    const data = {};

    return data;
  }
}
