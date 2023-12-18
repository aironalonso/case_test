// Regular Expression for Validation
var strRegex = /^[a-zA-Z\s]*$/;
// Containing only letters
var emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
var phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
// Supports following number formats - (123) 456-7890, (123)456-7890, 123-456-7890, 123.456.7890, 1234567890, +31636363634, 075-63546725
var digitRegex = /^\d+$/;
// ---------------------------------------------------------- //
var countryList = document.getElementById('country-list');
var fullscreenDiv = document.getElementById('fullscreen');
var modal = document.getElementById('modal');
var addBtn = document.getElementById('add-btn');
var closeBtn = document.getElementById('close-btn');
var modalBtns = document.getElementById('modal-btns');
var form = document.getElementById('modal');
var addrBookList = document.querySelector('#addr-book-list tbody');
var Address = /** @class */ (function () {
    function Address(id, firstName, lastName, email, phone, streetAddr, postCode, city, country) {
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
    Address.getAddresses = function () {
        var addresses;
        if (localStorage.getItem('addresses') == null) {
            addresses = [];
        }
        else {
            addresses = JSON.parse(localStorage.getItem('addresses'));
        }
        return addresses;
    };
    Address.addAddress = function (address) {
        var addresses = Address.getAddresses();
        addresses.push(address);
        localStorage.setItem('addresses', JSON.stringify(addresses));
    };
    Address.deleteAddress = function (id) {
        var addresses = Address.getAddresses();
        addresses.forEach(function (address, index) {
            if (address.id == id) {
                addresses.splice(index, 1);
            }
        });
        localStorage.setItem('addresses', JSON.stringify(addresses));
        form.reset();
        UI.closeModal();
        addrBookList.innerHTML = "";
        UI.showAddressList();
    };
    Address.updateAddress = function (item) {
        var addresses = Address.getAddresses();
        addresses.forEach(function (address) {
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
    };
    return Address;
}());
var UI = /** @class */ (function () {
    function UI() {
    }
    UI.showAddressList = function () {
        var addresses = Address.getAddresses();
        addresses.forEach(function (address) { return UI.addToAddressList(address); });
    };
    UI.addToAddressList = function (address) {
        var tableRow = document.createElement('tr');
        tableRow.setAttribute('data-id', address.id.toString());
        tableRow.innerHTML = "\n      <td>".concat(address.id, "</td>\n      <td>").concat(address.firstName + " " + address.lastName, "</td>\n      <td><span>").concat(address.email, "</span></td>\n      <td>\n          <span class = \"address\">").concat(address.streetAddr, " ").concat(address.postCode, " ").concat(address.city, " ").concat(address.country, "</span>\n      </td>\n      <td>").concat(address.phone, "</td>\n    ");
        addrBookList.appendChild(tableRow);
    };
    UI.showModalData = function (id) {
        var addresses = Address.getAddresses();
        addresses.forEach(function (address) {
            if (address.id == id) {
                form.first_name.value = address.firstName;
                form.last_name.value = address.lastName;
                form.email.value = address.email;
                form.phone.value = address.phone;
                form.street_addr.value = address.streetAddr;
                form.postal_code.value = address.postCode;
                form.city.value = address.city;
                form.country.value = address.country;
                document.getElementById('modal-title').innerHTML = "Change Address Details";
                document.getElementById('modal-btns').innerHTML = "\n          <button type = \"submit\" id = \"update-btn\" data-id = \"".concat(id, "\">Update </button>\n          <button type = \"button\" id = \"delete-btn\" data-id = \"").concat(id, "\">Delete </button>\n        ");
            }
        });
    };
    UI.showModal = function () {
        modal.style.display = "block";
        fullscreenDiv.style.display = "block";
    };
    UI.closeModal = function () {
        modal.style.display = "none";
        fullscreenDiv.style.display = "none";
    };
    return UI;
}());
window.addEventListener('DOMContentLoaded', function () {
    loadJSON(); // loading country list from json file
    eventListeners();
    UI.showAddressList();
});
function eventListeners() {
    addBtn.addEventListener('click', function () {
        form.reset();
        document.getElementById('modal-title').innerHTML = "Add Address";
        UI.showModal();
        document.getElementById('modal-btns').innerHTML = "\n      <button type = \"submit\" id = \"save-btn\"> Save </button>\n    ";
    });
    closeBtn.addEventListener('click', UI.closeModal);
    modalBtns.addEventListener('click', function (e) {
        e.preventDefault();
        if (this.id == "save-btn") {
            var isFormValid = getFormData();
            if (!isFormValid) {
                form.querySelectorAll('input').forEach(function (input) {
                    setTimeout(function () {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            }
            else {
                var allItem = Address.getAddresses();
                var lastItemId = (allItem.length > 0) ? allItem[allItem.length - 1].id : 0;
                lastItemId++;
                var addressItem = new Address(lastItemId, firstName, lastName, email, phone, streetAddr, postCode, city, country);
                Address.addAddress(addressItem);
                UI.closeModal();
                UI.addToAddressList(addressItem);
                form.reset();
            }
        }
    });
    addrBookList.addEventListener('click', function (e) {
        UI.showModal();
        var trElement;
        if (this.parentElement.tagName == "TD") {
            trElement = this.parentElement.parentElement;
        }
        if (this.parentElement.tagName == "TR") {
            trElement = this.parentElement;
        }
        var viewID = trElement.dataset.id;
        UI.showModalData(viewID);
    });
    modalBtns.addEventListener('click', function (e) {
        if (this.id == 'delete-btn') {
            Address.deleteAddress(this.dataset.id);
        }
    });
    modalBtns.addEventListener('click', function (e) {
        e.preventDefault();
        if (this.id == "update-btn") {
            var id = this.dataset.id;
            var isFormValid = getFormData();
            if (!isFormValid) {
                form.querySelectorAll('input').forEach(function (input) {
                    setTimeout(function () {
                        input.classList.remove('errorMsg');
                    }, 1500);
                });
            }
            else {
                var addressItem = new Address(id, firstName, lastName, email, phone, streetAddr, postCode, city, country);
                Address.updateAddress(addressItem);
                UI.closeModal();
                form.reset();
            }
        }
    });
}
function loadJSON() {
    fetch('countries.json')
        .then(function (response) { return response.json(); })
        .then(function (data) {
        var html = "";
        data.forEach(function (country) {
            html += "\n          <option> ".concat(country.country, " </option>\n        ");
        });
        countryList.innerHTML = html;
    });
}
;
function getFormData() {
    var inputValidStatus = [];
    if (!strRegex.test(form.addr_ing_name.value) || form.addr_ing_name.value.trim().length == 0) {
        addErrMsg(form.addr_ing_name);
        inputValidStatus[0] = false;
    }
    else {
        var addrName = form.addr_ing_name.value;
        inputValidStatus[0] = true;
    }
    if (!strRegex.test(form.first_name.value) || form.first_name.value.trim().length == 0) {
        addErrMsg(form.first_name);
        inputValidStatus[1] = false;
    }
    else {
        var firstName = form.first_name.value;
        inputValidStatus[1] = true;
    }
    if (!strRegex.test(form.last_name.value) || form.last_name.value.trim().length == 0) {
        addErrMsg(form.last_name);
        inputValidStatus[2] = false;
    }
    else {
        var lastName = form.last_name.value;
        inputValidStatus[2] = true;
    }
    if (!emailRegex.test(form.email.value)) {
        addErrMsg(form.email);
        inputValidStatus[3] = false;
    }
    else {
        var email = form.email.value;
        inputValidStatus[3] = true;
    }
    if (!phoneRegex.test(form.phone.value)) {
        addErrMsg(form.phone);
        inputValidStatus[4] = false;
    }
    else {
        var phone = form.phone.value;
        inputValidStatus[4] = true;
    }
    if (!(form.street_addr.value.trim().length > 0)) {
        addErrMsg(form.street_addr);
        inputValidStatus[5] = false;
    }
    else {
        var streetAddr = form.street_addr.value;
        inputValidStatus[5] = true;
    }
    if (!digitRegex.test(form.postal_code.value)) {
        addErrMsg(form.postal_code);
        inputValidStatus[6] = false;
    }
    else {
        var postCode = form.postal_code.value;
        inputValidStatus[6] = true;
    }
    if (!strRegex.test(form.city.value) || form.city.value.trim().length == 0) {
        addErrMsg(form.city);
        inputValidStatus[7] = false;
    }
    else {
        var city = form.city.value;
        inputValidStatus[7] = true;
    }
    var country = form.country.value;
    return inputValidStatus.includes(false) ? false : true;
}
function addErrMsg(inputBox) {
    inputBox.classList.add('errorMsg');
}
