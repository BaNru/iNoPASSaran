/*
 * Generate You Shall Pass!
 *
 * @author Vladimir Kochergin (wawan93)
 * https://github.com/wawan93/you_shall_pass
 */
function ysp(s,mp,a) {
	var salt = mp+s+mp;
	var alphabet;
	if(a) {
		alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*([{}])_+~-'+'1234567890abcdefghijklmnopqrstuvwxyz!@#$%^&*([{}])_+~-ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	} else {
		alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890__--1234567890abcdefghijklmnopqrstuvwxyz__--ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	}
	var integer, j, temp, i, v, p;

	for (i = alphabet.length - 1, v = 0, p = 0; i > 0; i--, v++) {
		v %= salt.length;
		p += integer = salt[v].charCodeAt(0);
		j = (integer + v + p) % i;
		temp = alphabet[j];
		alphabet = alphabet.substr(0, j) + alphabet[i] + alphabet.substr(j + 1);
		alphabet = alphabet.substr(0, i) + temp + alphabet.substr(i + 1);
	}
	return alphabet.substr(1,15);
}