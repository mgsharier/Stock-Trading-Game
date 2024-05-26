import validator from 'validator';
// import { isAlphanumeric, isEmail, isMobilePhone } from 'validator';

let _validate_name = (name) => {
	return new Promise((resolve, reject) => {
		name = name.split(' ').join(''); //Removing blanks
		let is_valid = validator.isAlphanumeric(name);
		if (is_valid){
			resolve('The name is valid.');
		} else {
			reject('The name is invalid.');
		}
	});
};

let _validate_password = (password) => {
	return new Promise((resolve, reject) => {
                const minLength = 8;
                const hasRequiredLength = validator.isLength(password, { min: minLength });
                const hasNumbers = validator.matches(password, /\d/);
                const hasLetters = validator.matches(password, /[a-zA-Z]/);
                const hasSpecialCharacters = validator.matches(password, /[\W_]/);
                let is_valid = hasRequiredLength && hasNumbers && hasLetters && hasSpecialCharacters;
		if (is_valid){
			resolve('The password matches the requirement.');
		} else {
			reject('The password does not match the requirement');
		}
	});
}

export function validate_fields(name, password) {
	return Promise.all([_validate_name(name), _validate_password(password)])
		.then((values) => {
			return true;
		})
		.catch((err) => {
			console.log(err);
			return false;
		});
}

