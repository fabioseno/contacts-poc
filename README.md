# contacts-poc

This is an Ionic 3 app project that tries to reproduce limitations we came across using the Cordova Contacts plugin to read and write contacts on the mobile phone.

Issues found:

1) The plugin works fine to read contacts from the device, but on iOS, somehow the Neighbourhood in the address field is not retrieved.

2) iOS is updating an existing contact in the mobile contacts which has the same name and surname even though the operation was to create a new contact on the API. It appears to be an iOS behaviour.

3) There is no way to remove a phone number, email or address on an existing device contact. The workaround seems to be cloning the existing contact and saving the new one with the updated information.