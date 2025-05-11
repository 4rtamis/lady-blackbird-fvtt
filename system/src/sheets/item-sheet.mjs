const { api, sheets } = foundry.applications;

export class LadyBlackbirdItemSheet extends api.HandlebarsApplicationMixin(
  sheets.ItemSheetV2,
) {
  _editModeEnabled = false;

  get system() {
    return this.item.system;
  }

  /** @override */
  static DEFAULT_OPTIONS = {
    actions: {
      toggleEditMode: LadyBlackbirdItemSheet._onToggleEditMode,
    },
    classes: ["lady-blackbird", "sheet", "item-sheet"],
    form: {
      closeOnSubmit: false,
      submitOnChange: true,
    },
    position: {
      height: "auto",
      width: 600,
    },
    tag: "form",
  };

  static PARTS = {
    form: {
      template: "systems/lady-blackbird/templates/item/item-trait-sheet.hbs",
    },
  };

  _onRender(context, options) {
    super._onRender(context, options);
  }

  static async _onToggleEditMode(event, target) {
    event.preventDefault();
    this._editModeEnabled = !this._editModeEnabled;
    await this.submit();
    this.render();
  }

  async _prepareContext(options = {}) {
    const context = await super._prepareContext(options);
    const data = this.document.toObject(false);

    const isEditable = this.isEditable;

    context.cssClass = isEditable ? "editable" : "locked";
    context.editable = isEditable;

    context.editModeEnabled = this._editModeEnabled;
    context.editModeDisabled = !context.editModeEnabled;

    context.document = this.document;
    context.data = data;
    context.item = this.item;
    context.systemSource = this.system._source;
    context.systemFields = this.document.system.schema.fields;
    context.system = this.system;

    console.log("context", context);

    return context;
  }
}
