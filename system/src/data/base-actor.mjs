import LadyBlackbirdDataModel from "./base-model.mjs";

export default class LadyBlackbirdActorBase extends LadyBlackbirdDataModel {
  static defineSchema() {
    const fields = foundry.data.fields;
    const requiredInteger = { required: true, nullable: false, integer: true };
    const schema = {};

    return schema;
  }
}
