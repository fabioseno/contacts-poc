import { Component, OnInit } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Contacts } from '@ionic-native/contacts';
import { ContactPage } from '../contact/contact';

@Component({
    selector: 'page-contacts',
    templateUrl: 'contacts.html'
})
export class ContactsPage implements OnInit {
    private myContacts = [];

    constructor(public navCtrl: NavController,
        private platform: Platform,
        private alertController: AlertController,
        private contacts: Contacts) {
    }

    sortByName(contacts) {
        return contacts.sort(function (a, b) {
            if (!a.name) {
                a.name = '';
            }

            if (!b.name) {
                b.name = '';
            }

            return a.name.localeCompare(b.name);
        });
    }

    convertFromDeviceContact(deviceContact) {
        let newContact: any = {
            deviceContactId: deviceContact.id,
            birthday: deviceContact.birthday,
            note: deviceContact.note
        };

        if (deviceContact.name) {
            newContact.name = deviceContact.name.formatted;
        }

        if (deviceContact.organizations && Array.isArray(deviceContact.organizations) && deviceContact.organizations.length > 0) {
            let deviceOrganization = deviceContact.organizations[0];

            if (deviceOrganization.name) {
                newContact.location = deviceOrganization.name;
            }

            if (deviceOrganization.title) {
                newContact.title = deviceOrganization.title;
            }
        }

        if (deviceContact.phoneNumbers && Array.isArray(deviceContact.phoneNumbers)) {
            newContact.phones = deviceContact.phoneNumbers.map(phone => {
                return {
                    type: phone.type,
                    value: phone.value,
                    main: phone.pref
                }
            });
        }

        if (deviceContact.emails && Array.isArray(deviceContact.emails)) {
            newContact.emails = deviceContact.emails.map(email => {
                return {
                    type: email.type,
                    value: email.value,
                    main: email.pref
                }
            });
        }

        if (deviceContact.addresses && Array.isArray(deviceContact.addresses)) {
            newContact.addresses = deviceContact.addresses.map(address => {
                let addressParts = [];

                if (address.streetAddress) {
                    addressParts = address.streetAddress.split('\n');
                }

                return {
                    type: address.type,
                    line1: addressParts.length >= 1 ? addressParts[0] : '',
                    line2: addressParts.length === 2 ? addressParts[1] : '',
                    postalCode: address.postalCode,
                    city: address.locality,
                    state: address.region,
                    country: address.country,
                    main: address.pref
                }
            });
        }

        if (deviceContact.ims && Array.isArray(deviceContact.ims)) {
            newContact.ims = deviceContact.ims.map(ims => {
                if (ims.type === 'rapix') {
                    newContact.source = 'rapix';
                    newContact.internalId = deviceContact.source + '_' + ims.value;
                }

                return {
                    type: ims.type,
                    value: ims.value,
                    main: ims.pref
                }
            });
        }

        return newContact;
    }

    openDetails(contact, event?) {
        if (event) {
            event.stopPropagation();
        }

        let alert = this.alertController.create({
            title: contact.name,
            message: JSON.stringify(contact, null, "\t")
        });

        alert.present();
    }

    editContact(contact) {
        this.navCtrl.push(ContactPage, {
            contact: contact
        });
    }

    addContact() {
        this.navCtrl.push(ContactPage);
    }

    async importContacts(refresher?) {
        this.myContacts = [];

        let deviceContacts = await this.contacts.find(['*'], { multiple: true });

        for (let i = 0; i < deviceContacts.length; i++) {
            this.myContacts.push(this.convertFromDeviceContact(deviceContacts[i]));
        }

        this.myContacts = this.sortByName(this.myContacts);

        if (refresher) {
            refresher.complete();
        }
    }

    ngOnInit() {
        this.platform.ready().then(() => {
            this.importContacts();
        });
    }
}