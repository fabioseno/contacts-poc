# contacts-poc

This is an Ionic 3 app project that tries to reproduce limitations we came across using the Cordova Contacts plugin to read and write contacts on the mobile phone.

Once running the app on a device (need to accept Contacts Access permission), all device contacts are automatically imported into the app so you can view/edit each contact's details, which in turn will update the contact on the phone (at least should).


## Issues found:

### 1. Reading address info
The plugin works fine to read contacts from the device, but on iOS, somehow the Neighbourhood in the address field is not retrieved.

#### Steps to reproduce:

1. Create a contact on the phone, preferably a name that will force the contact to be in the top of the list

2. Fill in an entire address, using all fields

3. Open the demo app

4. Tap on the view button or open the contact details. The `Neighbourhood` is not being retrieved neither being saved on the phone.


### 2. Contact merge
iOS is updating existing contacts on the device if you save a contact with the same `name` field even though the operation was to create a new contact on the API. It appears to be an iOS behaviour.

#### Steps to reproduce:

1. Create a new contact on the phone

2. Open the demo app and add a new contact using an existing name and fill in the `location` and `title` field, for instance.

3. Back to the contacts list on the device, there will be only one contact with merged information


### 3. Array item duplications
Contact array items (phones, emails, addressses, etc) are being duplicated on the phone when edited in the app.

#### Steps to reproduce:

1. Create a new contact (on device or in the app) with a phone number

2. Open the contact details in the app and add a new different phone number

3. Open the contact details on the phone and there will be 3 phone numbers, instead of 2.


### 4. Mobile deep linking
Cannot make a contact Instant Messaging (IM) field open a custom app. Camcard app does this pretty well if you save a Camcard phone on the device.


** DO THESE TESTS AT YOUR OWN RISK, AS THE PLUGIN (OR THE CODE) MAY CONTAIN BUGS AND MISTAKENLY CHANGE ANY DEVICE CONTACT