import LadyBlackbirdActorBase from "./base-actor.mjs";

export default class LadyBlackbirdCharacter extends LadyBlackbirdActorBase {
  static defineSchema() {
    const fields = foundry.data.fields;
    const schema = super.defineSchema();

    schema.description = new fields.StringField({
      required: true,
      blank: true,
    });

    schema.traits = new fields.ArrayField(
      new fields.SchemaField({
        name: new fields.StringField({
          required: true,
          blank: false,
        }),
        tags: new fields.ArrayField(
          new fields.SchemaField({
            name: new fields.StringField({
              required: true,
              blank: false,
            }),
            group: new fields.StringField({
              required: false,
              blank: true,
            }),
          }),
        ),
      }),
    );

    return schema;
  }

  prepareDerivedData() {}

  getRollData() {
    const data = {};

    return data;
  }
}
