class FuzzyMatcher {
	static #levenshteinDistance(a, b) {
		const matrix = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));

		for (let i = 1; i <= a.length; i++) {
			for (let j = 1; j <= b.length; j++) {
				if (a[i - 1] === b[j - 1]) {
					matrix[i][j] = matrix[i - 1][j - 1];
				} else {
					matrix[i][j] = 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
				}
			}
		}

		return matrix[a.length][b.length];
	}

	static getScore(filter, tag) {
		if (filter === tag || (tag.startsWith(filter) && filter.length > 1)) {
			return 1.0;
		}

		const distance = FuzzyMatcher.#levenshteinDistance(filter, tag);
		const maxLength = Math.max(filter.length, tag.length);
		return 1 - distance / maxLength;
	}
}

module.exports = FuzzyMatcher;
