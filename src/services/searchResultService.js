require("../utils/AccentsRemover");
const FuzzyMatcher = require("../utils/FuzzyMatcher.js");

class SearchResultService {
	static filterSearchResults(data, filters) {
		// Convert filters to array and lowercase
		filters = filters.split(" ");

		// Filter the results, calculate the match score, and remove items with match score of 0
		return data
			.map((item) => {
				const tags = item.tags.concat(item.genre);
				// Calculate the match score for each item
				let matchScore = 0;
				filters.forEach((filter) => {
					tags.forEach((tag) => {
						const tags = tag.split(" ");
						tags.forEach((tag) => {
							const similarity = FuzzyMatcher.getScore(filter.toLowerCase().removeAccents(), tag.toLowerCase().removeAccents());
							if (similarity >= 0.6) matchScore++;
							console.log({ filter: filter.toLowerCase().removeAccents(), tag: tag.toLowerCase().removeAccents(), matchScore: matchScore, similarity: similarity });
						});
					});
				});
				return { item, matchScore };
			})
			.filter((item) => item.matchScore > 0)
			.sort((a, b) => b.item.createdAt - a.item.createdAt) // Sort by date, newest first
			.sort((a, b) => b.matchScore - a.matchScore) // Sort on match score
			.map((data) => data.item); // Take out the items
	}
}

module.exports = SearchResultService;
