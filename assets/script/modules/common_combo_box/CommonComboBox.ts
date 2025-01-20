import * as fgui from "fairygui-cc";
import { TextHelper } from "../../helpers/TextHelper";

export class CommonComboBox extends fgui.GComboBox {
    public showDropdown() {
        let fun = function () {
            let self = this
            if (self._itemsUpdated) {
                self._itemsUpdated = false;

                self._list.removeChildrenToPool();
                var cnt: number = self._items.length;
                for (var i: number = 0; i < cnt; i++) {
                    var item: fgui.GObject = self._list.addItemFromPool();
                    item.name = i < self._values.length ? self._values[i] : "";
                    item.text = self._items_rich_color ? TextHelper.ColorStr(self._items[i], self._items_rich_color[i]) : self._items[i];
                    item.icon = (self._icons && i < self._icons.length) ? self._icons[i] : null;
                }
                self._list.resizeToFit(self._visibleItemCount);
            }
            self._list.selectedIndex = self._selectedIndex;
            self.dropdown.width = self.width
            self._list.ensureBoundsCorrect();
            fgui.GRoot.inst.togglePopup(this.dropdown, this, this._popupDirection);
            if (this.dropdown.parent)
                this.setState(fgui.GButton.DOWN);
        }.bind(this)
        fun()
    }

    private _items_rich_color: string[]
    public set items_rich(value: string[]) {
        this._items_rich_color = value;
    }
}