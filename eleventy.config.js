export default function(eleventyConfig) {
  // Pass through static assets
  eleventyConfig.addPassthroughCopy("src/assets/images");
  eleventyConfig.addPassthroughCopy("src/assets/fonts");

  // Watch for CSS changes
  eleventyConfig.addWatchTarget("src/assets/css/");

  // Add a filter to find topic by slug
  eleventyConfig.addFilter("findBySlug", function(collection, slug) {
    return collection.find(item => item.slug === slug);
  });

  // Add a shortcode for current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
}
