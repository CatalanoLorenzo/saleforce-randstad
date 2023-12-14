import { LightningElement, track } from 'lwc';

//recupero dei campi associati all'oggetto Contact
import FIRSTNAME_FIELD from '@salesforce/schema/Contact.FirstName';
import LASTNAME_FILD from '@salesforce/schema/Contact.LastName';
import BIRTHDATE_FILD from '@salesforce/schema/Contact.Birthdate';
import EMAIL_FILD from '@salesforce/schema/Contact.Email';
import DEPARTMENT_FILD from '@salesforce/schema/Contact.Department';
//import Methods
import CreateContact from '@salesforce/apex/CreateContactAPEX.CreateContact'
//import di  ShowToastEvent
import { ShowToastEvent } from 'lightning/platformShowToastEvent';


export default class NewAccount extends LightningElement {
    //----VARIABILI---------
    //associo i FILDS di contact importati a delle variabili
    @track fristName = FIRSTNAME_FIELD;
    @track lastName = LASTNAME_FILD;
    @track birthDate = BIRTHDATE_FILD;
    @track email = EMAIL_FILD;
    @track department = DEPARTMENT_FILD
    //creo un oggetto constituito da key (nome dei Filds) 
    //e come valori le vriabili associati create in precedenza
    contactCreateOBJ = {
        FristName: this.fristName,
        LastName: this.lastName,
        BirthDate: this.birthDate,
        Email: this.email,
        Department: this.department
    }
    //--------FUNZIONI-----------
    //creo funzioni per ogni singolo input che mi permettono di riempire
    // l'oggetto contactCreateOBJ con i dati dell'input
    setValueInputFristName(event) {
        this.contactCreateOBJ.FristName = event.target.value;
    }
    setValueInputLastName(event) {
        this.contactCreateOBJ.LastName = event.target.value;
    }
    setValueInputBirthDate(event) {
        this.contactCreateOBJ.BirthDate = event.target.value;
    }
    setValueInputEmail(event) {
        this.contactCreateOBJ.Email = event.target.value;
    }
    setValueInputDepartment(event) {
        this.contactCreateOBJ.Department = event.target.value;
    }
    sendContactOBJ() {
        //utilizzo il metodo del controller contactCreateAPEX e gli passo i paramentro richiesto
        CreateContact({ contactCreateOBJ: this.contactCreateOBJ })
            .then(result => {
                //se il risultato  è positivo lo salvo in message
                this.message = result;
                //svuoto l'error
                this.error = undefined;
                //mi assicuro che message non è vuoto
                if (this.message !== undefined) {
                    //resetto le variabili
                    this.contactCreateOBJ.FristName = "";
                    this.contactCreateOBJ.LastName = "";
                    this.contactCreateOBJ.BirthDate = "";
                    this.contactCreateOBJ.Email = "";
                    this.contactCreateOBJ.Department = "";
                    //mosto un messaggio di avvenuto succeso  con ShowToastEvent
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success',
                            message: 'Contact created Succesfully',
                            variant: 'success',
                        }),
                    );
                    //mosto in console per verifica il result  convertita in stringa perchè è in formato JSON
                    console.log(JSON.stringify(result));
                    console.log("result", this.message);
                }
            })
            .catch(error => {
                //vuoto message
                this.message = undefined;
                //riempio error con l'errore ricevuto 
                this.error = error;
                //mosto un messaggio di errore con messaggio il messaggio del corpo dell'errore
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Failed to Insert record',
                        message: error.body.message,
                        variant: 'error',
                    })
                )
                console.log("error", JSON.stringify(this.error))
            })
    }
}