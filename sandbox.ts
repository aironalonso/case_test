// Regular Expression for Validation
const strRegex = /^[a-zA-Z\s]*$/;

// Containing only letters
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;

// Supports following number formats - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725
const digitRegex = /^\d+$/;

// ---------------------------------------------------------- //

const countryList = document.getElementById('country-list') as HTMLSelectElement;
const fullscreenDiv = document.getElementById('fullscreen') as HTMLDivElement;
const modal = document.getElementById('modal') as HTMLFormElement;
const addBtn = document.getElementById('add-btn') as HTMLButtonElement;
const closeBtn = document.getElementById('close-btn') as HTMLButtonElement;
const modalBtns = document.getElementById('modal-btns') as HTMLButtonElement;
const form = document.getElementById('modal') as HTMLFormElement;
const addrBookList = document.querySelector('#addr-book-list tbody') as HTMLDivElement;

// ---------------------------------------------------------- //

interface AddressProps {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    streetAddr: string;
    postCode: string;
    city: string;
    country: string;
}

class Address {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    streetAddr: string;
    postCode: string;
    city: string;
    country: string;

    constructor(id: number, firstName: string, lastName: string, email: string, phone: string, streetAddr: string, postCode: string, city: string, country: string) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.phone = phone;
        this.streetAddr = streetAddr;
        this.postCode = postCode;
        this.city = city;
        this.country = country;
    }

    static getAddresses(): Address[] {
        let addresses: Address[];
        if (localStorage.getItem('addresses') == null) {
            addresses = [];
        } else {
            addresses = JSON.parse(localStorage.getItem('addresses')!);
        }
        return addresses;
    }

    static addAddress(address: Address): void {
        const addresses = Address.getAddresses();
        addresses.push(address);
        localStorage.setItem('addresses', JSON.stringify(addresses));
    }

    static deleteAddress(id: number): void {
        const addresses = Address.getAddresses();
        addresses.forEach((address, index) => {
            if (address.id == id) {
                addresses.splice(index, 1);
            }
        });
        localStorage.setItem('addresses', JSON.stringify(addresses));
        form.reset();
        UI.closeModal();
        addrBookList.innerHTML = "";
        UI.showAddressList();
    }

    static updateAddress(item: Address): void {
        const addresses = Address.getAddresses();
        addresses.forEach(address => {
            if (address.id == item.id) {
                address.firstName = item.firstName;
                address.lastName = item.lastName;
                address.email = item.email;
                address.phone = item.phone;
                address.streetAddr = item.streetAddr;
                address.postCode = item.postCode;
                address.city = item.city;
                address.country = item.country;
            }
        });
        localStorage.setItem('addresses', JSON.stringify(addresses));
        addrBookList.innerHTML = "";
        UI.showAddressList();
    }
}

class UI {
    static showAddressList(): void {
        const addresses = Address.getAddresses();
        addresses.forEach(address => UI.addToAddressList(address));
    }

    static addToAddressList(address: Address): void {
        const tableRow = document.createElement('tr');
        tableRow.setAttribute('data-id', address.id.toString());
        tableRow.innerHTML = `
      <td>${address.id}</td>
      <td>${address.firstName + " " + address.lastName}</td>
      <td><span>${address.email}</span></td>
      <td>
          <span class = "address">${address.streetAddr} ${address.postCode} ${address.city} ${address.country}</span>
      </td>
      <td>${address.phone}</td>
    `;
        addrBookList.appendChild(tableRow);
    }

    static showModalData(id: number): void {
        const addresses = Address.getAddresses();
        addresses.forEach(address => {
            if (address.id == id) {
                form.first_name.value = address.firstName;
                form.last_name.value = address.lastName;
                form.email.value = address.email;
                form.phone.value = address.phone;
                form.street_addr.value = address.streetAddr;
                form.postal_code.value = address.postCode;
                form.city.value = address.city;
                form.country.value = address.country;
                document.getElementById('modal-title')!.innerHTML = "Change Address Details";
                document.getElementById('modal-btns')!.innerHTML = `
          <button type = "submit" id = "update-btn" data-id = "${id}">Update </button>
          <button type = "button" id = "delete-btn" data-id = "${id}">Delete </button>
        `;
            }
        });
    }

    static showModal(): void {
        modal.style.display = "block";
        fullscreenDiv.style.display = "block";
    }

    static closeModal(): void {
        modal.style.display = "none";
        fullscreenDiv.style.display = "none";
    }

}

window.addEventListener('DOMContentLoaded', () => {
    loadJSON(); // loading country list from json file
    eventListeners();
    UI.showAddressList();
});

function eventListeners(): void {
    addBtn.addEventListener('click', () => {
        form.reset();
        document.getElementById('modal-title')!.innerHTML = "Add Address";
        UI.showModal();
        document.getElementById('modal-btns')!.innerHTML = `
      <button type = "submit" id = "save-btn"> Save </button>
    `;
    });
 
    closeBtn.addEventListener('click', UI.closeModal);

    modalBtns.addEventListener('click', function(this: HTMLButtonElement, e: Event) {
        e.preventDefault();
        if (this.id == "save-btn") {
            let isFormValid = getFormData();
            if (!isFormValid) {
                form.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            } else {
                let allItem = Address.getAddresses();
                let lastItemId = (allItem.length > 0) ? allItem[allItem.length - 1].id : 0;
                lastItemId++;

                const addressItem = new Address(lastItemId, firstName, lastName, email, phone, streetAddr, postCode, city, country);
                Address.addAddress(addressItem);
                UI.closeModal();
                UI.addToAddressList(addressItem);
                form.reset();
            }
        }
    });

    addrBookList.addEventListener('click', function(this: HTMLTableCellElement, e: Event) {
        UI.showModal();
        let trElement: string;
        if (this.parentElement.tagName == "TD") {
            trElement = this.parentElement.parentElement;
        }

        if (this.parentElement.tagName == "TR") {
            trElement = this.parentElement;
        }

        let viewID = trElement.dataset.id;
        UI.showModalData(viewID);
    });

    modalBtns.addEventListener('click', function(this: HTMLButtonElement, e: Event) {
        if (this.id == 'delete-btn') {
            Address.deleteAddress(this.dataset.id);
        }
    });

    modalBtns.addEventListener('click', function(this: HTMLButtonElement, e: Event) {
        e.preventDefault();
        if (this.id == "update-btn") {
            let id = this.dataset.id;
            let isFormValid = getFormData();
            if (!isFormValid) {
                form.querySelectorAll('input').forEach(input => {
                    setTimeout(() => {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            } else {
                const addressItem = new Address(id, firstName, lastName, email, phone, streetAddr, postCode, city, country);
                Address.updateAddress(addressItem);
                UI.closeModal();
                form.reset();
            }
        }
    });
}

function loadJSON(): void {
    fetch('countries.json')
        .then(response => response.json())
        .then(data => {
            let html = "";
            data.forEach(country => {
                html += `
          <option> ${country.country} </option>
        `;
            });
            countryList.innerHTML = html;
        });
};

function getFormData(): boolean {
    let inputValidStatus: boolean[] = [];

    if (!strRegex.test(form.addr_ing_name.value) || form.addr_ing_name.value.trim().length == 0) {
        addErrMsg(form.addr_ing_name);
        inputValidStatus[0] = false;
    } else {
        let addrName = form.addr_ing_name.value;
        inputValidStatus[0] = true;
    }

    if (!strRegex.test(form.first_name.value) || form.first_name.value.trim().length == 0) {
        addErrMsg(form.first_name);
        inputValidStatus[1] = false;
    } else {
        let firstName = form.first_name.value;
        inputValidStatus[1] = true;
    }

    if (!strRegex.test(form.last_name.value) || form.last_name.value.trim().length == 0) {
        addErrMsg(form.last_name);
        inputValidStatus[2] = false;
    } else {
        let lastName = form.last_name.value;
        inputValidStatus[2] = true;
    }

    if (!emailRegex.test(form.email.value)) {
        addErrMsg(form.email);
        inputValidStatus[3] = false;
    } else {
        let email = form.email.value;
        inputValidStatus[3] = true;
    }

    if (!phoneRegex.test(form.phone.value)) {
        addErrMsg(form.phone);
        inputValidStatus[4] = false;
    } else {
        let phone = form.phone.value;
        inputValidStatus[4] = true;
    }

    if (!(form.street_addr.value.trim().length > 0)) {
        addErrMsg(form.street_addr);
        inputValidStatus[5] = false;
    } else {
        let streetAddr = form.street_addr.value;
        inputValidStatus[5] = true;
    }

    if (!digitRegex.test(form.postal_code.value)) {
        addErrMsg(form.postal_code);
        inputValidStatus[6] = false;
    } else {
        let postCode = form.postal_code.value;
        inputValidStatus[6] = true;
    }

    if (!strRegex.test(form.city.value) || form.city.value.trim().length == 0) {
        addErrMsg(form.city);
        inputValidStatus[7] = false;
    } else {
        let city = form.city.value;
        inputValidStatus[7] = true;
    }
    let country = form.country.value;
    return inputValidStatus.includes(false) ? false : true;
}

function addErrMsg(inputBox: HTMLInputElement): void {
    inputBox.classList.add('errorMsg');
}