import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ContactField, ContactOrganization, ContactAddress, Contact, Contacts, ContactName } from '@ionic-native/contacts';
import { AbstractControlDirective } from '@angular/forms';

@Component({
    selector: 'page-contact',
    templateUrl: 'contact.html'
})
export class ContactPage implements OnInit {

    private contact: any = {};

    constructor(public navCtrl: NavController,
        private navParams: NavParams,
        private contacts: Contacts) {

    }

    loadContact(contact) {
        this.contact = contact;
    }

    updateContact() {
        let contact = this.contact;

        let deviceContact: Contact;
        let searchField;
        let id;

        searchField = 'id';
        id = contact.deviceContactId;

        this.contacts.find([searchField], {
            filter: id
        }).then(async contacts => {
            if (contacts.length === 1) {
                deviceContact = contacts[0];

                // if (this.shouldCloneContact(deviceContact, contact)) {
                //     let clonedContact = this.clone(deviceContact);

                //     if (clonedContact) {
                //         await deviceContact.remove();

                //         deviceContact = clonedContact;
                //     }
                // }
            } else {
                deviceContact = this.contacts.create();
            }

            if (contact.name) {
                let nameParts = contact.name.split(' ');
                let name = new ContactName(null, null, contact.name);

                if (nameParts.length > 1) {
                    name = new ContactName(null, contact.name.replace(nameParts[0], '').trim(), nameParts[0]);
                }

                deviceContact.name = name;
            }

            if (contact.birthday) {
                deviceContact.birthday = contact.birthday;
            }

            if (contact.phones && contact.phones.length > 0) {
                deviceContact.phoneNumbers = [];

                for (let i = 0; i < contact.phones.length; i++) {
                    let phone = contact.phones[i];

                    if (!phone.value) {
                        phone.value = '';
                    }

                    deviceContact.phoneNumbers[i] = new ContactField(phone.type, phone.value.replace(/[()-\s.]/gi, ''));
                }
            }

            if (contact.emails && contact.emails.length > 0) {
                deviceContact.emails = [];

                for (let i = 0; i < contact.emails.length; i++) {
                    let email = contact.emails[i];

                    deviceContact.emails.push(new ContactField(email.type, email.value));
                }
            }

            if (contact.addresses && contact.addresses.length > 0) {
                deviceContact.addresses = [];

                for (let i = 0; i < contact.addresses.length; i++) {
                    let address = contact.addresses[i];

                    address.line1 = address.line1 || '';
                    address.line2 = address.line2 || '';

                    deviceContact.addresses.push(new ContactAddress(true, address.type, null, address.line1 + '\n' + address.line2, address.city, address.state, address.postalCode, address.country));
                }
            }

            deviceContact.organizations = [];
            deviceContact.organizations.push(new ContactOrganization('work', contact.location, null, contact.title));

            deviceContact.save().then(savedContact => {
                contact.deviceContactId = savedContact.id;

                alert('Saved!');
                this.navCtrl.pop();
            }, error => {
                console.log(error);
                alert(error);
            });
        });
    }

    addInfo(collection, defaultType?) {
        this.contact[collection] = this.contact[collection] || [];
        let newItem: any = {};

        if (collection !== 'addresses') {
            newItem = {
                type: 'home',
                value: ''
            };
        } else {
            newItem = {
                type: 'home',
                line1: '',
                line2: '',
                neighbourhood: '',
                city: '',
                state: '',
                postalCode: '',
                country: ''
            };
        }


        if (defaultType) {
            newItem.type = defaultType;
        }

        this.contact[collection].push(newItem);
    }

    removeInfo(collection, value) {
        let index = this.contact[collection].indexOf(value);

        if (index >= 0) {
            this.contact[collection].splice(index, 1);
        }
    }

    ngOnInit() {
        this.loadContact(this.navParams.get('contact') || {});
    }

}
