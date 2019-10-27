export const ButtonType =
    {
        Primary: "Primary",
        Secondary: "Secondary",
        Success: "Success",
        Info: "Info",
        Warning: "Warning",
        Danger: "Danger"
    };

export default class PopupButtons {
    static _buttonInstance = 0;

    static activePopup;

    constructor() {
        PopupButtons.activePopup = this;
        this.allButtons = [];
        this.allButtonsAction = [];
    }

    /**
     *
     * @param {string} title
     * @param {function} onClick
     * @param {ButtonType} type
     */
    addButton(title, onClick, type = ButtonType.Primary) {
        this.allButtons.push({
            id: PopupButtons._buttonInstance++,
            title: title,
            type: type
        });

        this.allButtonsAction.push(onClick);
    }

    parse() {
        const arr = JSON.stringify(this.allButtons);
        console.log("> " + arr);
        return "{\"buttons\": " + arr + "}";
    }

    /**
     *
     * @param {int} id
     */
    buttonClicked(id) {
        for (let i = 0; i < this.allButtons.length; i++) {
            if (this.allButtons[i].id === id) {
                const action = this.allButtonsAction[i];
                if (action)
                    action();
                break;
            }
        }
    }
}
