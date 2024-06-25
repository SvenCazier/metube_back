class AccentsRemover {
	static removeAccents(str) {
		const accentMap = {
			á: "a",
			à: "a",
			â: "a",
			ä: "a",
			å: "a",
			æ: "ae",
			ã: "a",
			ą: "a",
			ā: "a",
			ç: "c",
			ć: "c",
			č: "c",
			ð: "d",
			é: "e",
			è: "e",
			ê: "e",
			ë: "e",
			ę: "e",
			ē: "e",
			í: "i",
			ì: "i",
			î: "i",
			ï: "i",
			ł: "l",
			ñ: "n",
			ń: "n",
			ň: "n",
			ó: "o",
			ò: "o",
			ô: "o",
			ö: "o",
			ø: "o",
			õ: "o",
			œ: "oe",
			ō: "o",
			ř: "r",
			ß: "ss",
			ś: "s",
			š: "s",
			ť: "t",
			ú: "u",
			ù: "u",
			û: "u",
			ü: "u",
			ů: "u",
			ū: "u",
			ý: "y",
			ÿ: "y",
			ž: "z",
			ź: "z",
			ż: "z",
		};

		return str.replace(/[^\u0000-\u007E]/g, function (ch) {
			return accentMap[ch] || ch;
		});
	}
}

module.exports = String.prototype.removeAccents = function () {
	return AccentsRemover.removeAccents(this);
};
