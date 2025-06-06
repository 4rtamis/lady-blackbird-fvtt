const { sheets, api } = foundry.applications;
//import { select } from "@client/applications/handlebars.mjs";
import LadyBlackbirdItemBase from "../data/base-item.mjs";

/**
 * Extend the basic ActorSheet with some very simple modifications
 * @extends {ActorSheetV2}
 */
export class LadyBlackbirdActorSheet extends api.HandlebarsApplicationMixin(
  sheets.ActorSheetV2,
) {
  // Define the default options for the sheet
  _editModeEnabled = false;
  _selectedTags = [];
  #dragDrop = this.#createDragDropHandlers();

  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["lady-blackbird", "sheet", "character-sheet"],
    tag: "form",
    form: {
      submitOnChange: true,
      closeOnSubmit: false,
    },
    position: {
      width: 800,
      height: "auto",
    },
    window: {
      resizable: true,
    },
    dragDrop: [{ dragSelector: ".draggable", dropSelector: null }],
    actions: {
      onRoll: this._onRoll,
      toggleEditMode: this._onToggleEditMode,
      toggleTag: this._onToggleTag,
    },
  };

  static PARTS = {
    form: {
      template:
        "systems/lady-blackbird/templates/actor/actor-character-sheet.hbs",
    },
  };

  get system() {
    return this.actor.system;
  }

  get dragDrop() {
    return this.#dragDrop;
  }

  #attachContextMenus() {
    // Create a context menu for items
    new foundry.applications.ux.ContextMenu.implementation(
      this.element,
      '[data-menu="item"]',
      [
        {
          name: "Edit Item",
          icon: '<i class="fas fa-pencil"></i>',
          callback: async (i) => {
            const uuid = i.dataset.uuid;
            if (!uuid) return;
            const item = await fromUuid(uuid);
            item?.sheet?.render(true);
          },
        },
        {
          name: "Delete Item",
          icon: '<i class="fas fa-trash"></i>',
          callback: async (i) => {
            const uuid = i.dataset.uuid;
            if (!uuid) return;
            const item = await fromUuid(uuid);
            await item?.delete?.();
          },
        },
      ],
      {
        jQuery: false,
      },
    );
  }

  // Create the drag-drop handlers
  #createDragDropHandlers() {
    return this.options.dragDrop.map((d) => {
      d.permissions = {
        dragstart: this._canDragStart.bind(this),
        drop: this._canDragDrop.bind(this),
      };
      d.callbacks = {
        dragstart: this._onDragStart.bind(this),
        dragover: this._onDragOver.bind(this),
        drop: this._onDrop.bind(this),
      };
      return new foundry.applications.ux.DragDrop.implementation(d);
    });
  }

  _canDragDrop(selector) {
    return this.isEditable;
  }

  _canDragStart(selector) {
    return this.isEditable;
  }

  async _onDrop(event) {
    const data =
      foundry.applications.ux.TextEditor.implementation.getDragEventData(event);
    const actor = this.actor;

    // Allow hooks to intercept the drop
    const allowed = Hooks.call("dropActorSheetData", actor, this, data);
    if (allowed === false) return;

    switch (data.type) {
      case "ActiveEffect":
      case "Actor":
      case "Folder":
        break;
      case "Item":
        return this._onDropItem(event, data);
    }
  }

  async _onDropItem(event, data) {
    if (!this.actor.isOwner) return false;

    // In your case, you might need to use a different method to get the item data
    const item = await Item.implementation.fromDropData(data);

    // Special handling for Trait items
    if (item.type === "trait") {
      // Add any special processing for trait items here
      // For example, you might want to handle trait-specific properties
    }

    // Handle item sorting within the same Actor
    if (this.actor.uuid === item.parent?.uuid)
      return this._onSortItem(event, item);

    // Create the owned item
    return this._onDropItemCreate(item, event);
  }

  async _onDropItemCreate(itemData, event) {
    itemData = itemData instanceof Array ? itemData : [itemData];
    return this.actor.createEmbeddedDocuments("Item", itemData);
  }

  static async _onToggleEditMode(event, target) {
    event.preventDefault();
    this._editModeEnabled = !this._editModeEnabled;
    await this.submit();
    this.render();
  }

  static async _onRoll(event, target) {
    event.preventDefault();
    const formula = target.dataset.formula;
    const roll = new foundry.dice.Roll(formula);
    await roll.evaluate();
    roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: `${this.actor.name} rolls ${formula}`,
    });
  }

  static async _onToggleTag(event, target) {
    event.preventDefault();

    const name = target.dataset.name;
    const group = target.dataset.group;
    const power = target.dataset.power;
    const trait = target.dataset.trait;
    const traitUuid = target.dataset.traitUuid;
    const tag = {
      name: name,
      group: group,
      power: power,
      trait: trait,
      traitUuid: traitUuid,
    };

    const selectedTags = this._selectedTags;

    // Check if the tag is already selected,
    const tagIndex = selectedTags.findIndex(
      (t) =>
        t.name === tag.name &&
        t.group === tag.group &&
        t.power === tag.power &&
        t.trait === tag.trait &&
        t.traitUuid === tag.traitUuid,
    );
    if (tagIndex !== -1) {
      // If the tag is already selected, remove it
      selectedTags.splice(tagIndex, 1);
    } else {
      // If the group is "default", simply add the tag
      if (tag.group !== "default") {
        // If the tag is not selected, check if one tag from the group is already selected
        const groupIndex = selectedTags.findIndex(
          (t) =>
            t.group === tag.group &&
            t.trait === tag.trait &&
            t.traitUuid === tag.traitUuid,
        );
        if (groupIndex !== -1) {
          // If one tag from the group is already selected, remove it
          selectedTags.splice(groupIndex, 1);
        }
      }
      // Add the new tag to the selected tags
      selectedTags.push(tag);
    }

    await this.submit();
    this.render();
  }

  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options = {}) {
    // Retrieve the data structure from the base sheet. You can inspect or log
    // the context variable to see the structure, but some key properties for
    // sheets are the actor object, the data object, whether or not it's
    // editable, the items array, and the effects array.
    const context = await super._prepareContext();

    // Use a safe clone of the actor data for further operations.
    const data = this.document.toPlainObject(false);

    const isEditable = this.isEditable;

    context.cssClass = isEditable ? "editable" : "locked";
    context.editable = isEditable;
    context.editModeEnabled = this._editModeEnabled;
    context.editModeDisabled = !this._editModeEnabled;

    context.document = this.document;
    context.data = data;
    context.limited = this.document.limited;
    context.options = this.options;
    context.owner = this.document.isOwner;
    context.title = this.title;
    context.actor = this.actor;
    context.effects = context.data.effects;
    context.items = context.data.items;
    context.traits = context.data.items.filter((i) => i.type === "trait");
    context.selectedTags = this._selectedTags;
    context.systemSource = this.actor.system._source;
    context.systemFields = this.document.system.schema.fields;
    context.system = this.system;

    console.log("context", context);
    return context;
  }

  /* -------------------------------------------- */

  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    this.#attachContextMenus();
  }

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);
    this.#dragDrop.forEach((d) => d.bind(this.element));
  }
}
