import LadyBlackbirdItemBase from "./base-item.mjs";

export default class LadyBlackbirdFeature extends LadyBlackbirdItemBase {
  static defineSchema() {
    const schema = super.defineSchema();
    const fields = foundry.data.fields;

    schema.tags = new fields.ArrayField(
      new fields.SchemaField({
        name: new fields.StringField({
          required: true,
          blank: false,
        }),
        group: new fields.StringField({
          required: false,
          blank: true,
        }),
        power: new fields.NumberField({
          required: true,
          nullable: false,
          initial: 0,
          min: 0,
          max: 10,
          integer: true,
        }),
      }),
    );

    return schema;
  }
}
