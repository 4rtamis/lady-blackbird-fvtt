import LadyBlackbirdItemBase from "./base-item.mjs";

export default class LadyBlackbirdTrait extends LadyBlackbirdItemBase {
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
          max: 3,
          integer: true,
        }),
      }),
    );

    return schema;
  }

  prepareDerivedData() {
    console.log("Preparing derived data for Trait", this);
    super.prepareDerivedData();

    const sortedTags = this.tags.sort((a, b) => {
      if (!a.group && b.group) return -1;
      if (a.group && !b.group) return 1;
      if (a.group === b.group) return 0;
      return a.group.localeCompare(b.group);
    });

    // Group tags
    const groupedTags = {};
    const ungroupedTags = [];

    sortedTags.forEach((tag) => {
      if (tag.group) {
        if (!groupedTags[tag.group]) groupedTags[tag.group] = [];
        groupedTags[tag.group].push(tag);
      } else {
        ungroupedTags.push(tag);
      }
    });

    // Structure passed to Handlebars
    this.sortedTags = {
      ungrouped: ungroupedTags,
      grouped: groupedTags,
    };
  }
}
