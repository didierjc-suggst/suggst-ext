var book = {};
var rankRegex = /\B(?=(\d{3})+(?!\d))/g;
var finalRecupCount = 0;
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var oqScore = {
    "oqScoreProductAuthority": 0,
    "oqScoreBrandAuthority": 0,
    "actions": []
};

var tabs = [
    {
        "name": "oqScore",
        "title": 'OQ Score',
        "url": 'oqscore.tpl.html',
        "class": "first",
        "score": 0,
        "action": {
            "value":"",
            "displayOn": ""
        },
        "range": {
            "best": 75,
            "worst": 40
        },
        "columns": [
            {
                "name": "firstColumn",
                "class": "firstColumn",
                "action": {
                    "value":"",
                    "displayOn": ""
                },
                "sections": [
                    {
                        "name": "oqScoreAuthority",
                        "title": "Authority",
                        "displayOnOQScoreTab":true,
                        "score": 0,
                        "action": {
                            "value":"",
                            "displayOn": ""
                        },
                        "lines": [
                            {
                                "name": "oqScoreProductAuthority",
                                "text": "Product Authority",
                                "explanation": "Algorithmically-defined assessment of whether your title is optimized to reach its maximum sales potential in Amazon. Range: 0-100.",
                                "weight": 70,
                                "displayOnOQScoreTab":true,
                                "action": {
                                    "value":"",
                                    "displayOn": ""
                                },
                                "score": {
                                    "min": 0,
                                    "max": 100,
                                    "real": 0
                                },
                                "range": {
                                    "best": 75,
                                    "worst": 40
                                },
                                "scorable": true,
                                "class": ""
                            },
                            {
                                "name": "oqScoreBrandAuthority",
                                "text": "Brand Authority",
                                "explanation": "Algorithmically-defined assessment of the power of an author online, as it relates to sales discovery and conversion in Amazon. Range: 0-100.",
                                "weight": 30,
                                "displayOnOQScoreTab":true,
                                "action": {
                                    "value":"",
                                    "displayOn": ""
                                },
                                "score": {
                                    "min": 0,
                                    "max": 100,
                                    "real": 0
                                },
                                "range": {
                                    "best": 75,
                                    "worst": 40
                                },
                                "scorable": true,
                                "class": ""
                            }
                        ]
                    }
                ]
            },
            {
                "name": "secondColumn",
                "class": "secondColumn",
                "action": {
                    "value":"",
                    "displayOn": ""
                },
                "sections": []
            },
            {
                "name": "lastColumn",
                "class": "lastColumn",
                "action": {
                    "value":"",
                    "displayOn": ""
                },
                "sections": [
                    {
                        "class": "twoLinesText",
                        "name": "oqScoreActions",
                        "title": "Insights & Actions",
                        "description": "Key issues and opportunities based on current scoring.",
                        "score": 0,
                        "lines": []
                    }
                ]
            }
        ]
    },
    {
        "name": "onPage",
        "title": 'On Page',
        "explanation": "This is a test",
        "url": 'onpage.tpl.html',
        "class": "",
        "score": 0,
        "displayOnOQScoreTab":true,
        "action": {
            "value":"",
            "displayOn": ""
        },
        "range": {
            "best": 75,
            "worst": 40
        },
        "columns": [
            {
                "name": "weightedCoverage",
                "title": "Marketing Assets",
                "description": "Presence of marketing content and assets",
                "explanation": "",
                "displayOnOQScoreTab":true,
                "action": {
                    "value":"",
                    "displayOn": ""
                },
                "weight": 55,
                "score": 0,
                "oqWeight": 5,
                "oqResult": "oqScoreProductAuthority",
                "range": {
                    "best": 75,
                    "worst": 40
                },
                "class": "firstColumn",
                "percent": 100,
                "sections": [
                    {
                        "name": "keyElements",
                        "title": "Key elements",
                        "score": 0,
                        "action": {
                            "value":"",
                            "displayOn": ""
                        },
                        "lines": [
                            {
                                "name": "coverImage",
                                "text": "Cover image",
                                "explanation": "Upload a high-quality, legible cover image.",
                                "action": {
                                    "value": "Include a high fidelity cover image.",
                                    "displayOn": "red"
                                },
                                "score": {
                                    "max": 15,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "lookInside",
                                "text": "Look inside",
                                "explanation": "Include \"Look inside\" for sample content (e.g. table of contents, first chapter, and/or internal illustrations and images).",
                                "action": {
                                    "value": "Consider using Look Inside.",
                                    "displayOn": "red"
                                },
                                "score": {
                                    "max": 15,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "productDescription",
                                "text": "Product description",
                                "explanation": "Include a detailed description of the book up to a maximum of 4,000 characters.",
                                "action": {
                                    "value": "Create an accurate, compelling description.",
                                    "displayOn": "red"
                                },
                                "score": {
                                    "max": 30,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "publisherReviews",
                                "text": "Professional reviews",
                                "explanation": "Include positive review quotes about the book and/or author.",
                                "action": {
                                    "value": "Include reviews on the product detail page.",
                                    "displayOn": "red"
                                },
                                "score": {
                                    "max": 20,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "authorBio",
                                "text": "Author bio",
                                "explanation": "Include an author bio, up to a maximum of 2,000 characters.",
                                "action": {
                                    "value": "Include a robust author biography.",
                                    "displayOn": "red"
                                },
                                "oqWeight": 5,
                                "oqResult": "oqScoreBrandAuthority",
                                "score": {
                                    "max": 20,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }
                        ]
                    }
                ]
            },
            {
                "name": "productTitleDescription",
                "title": "Title & Description",
                "description": "Structure, length, and formatting of product title and description",
                "explanation": "",
                "displayOnOQScoreTab":true,
                "action": {
                    "value":"",
                    "displayOn": ""
                },
                "weight": 45,
                "score": 0,
                "oqWeight": 10,
                "oqResult": "oqScoreProductAuthority",
                "range": {
                    "best": 75,
                    "worst": 40
                },
                "class": "secondColumn",
                "percent": 100,
                "sections": [
                    {
                        "name": "titleElements",
                        "title": "Title",
                        "action": {
                            "value":"",
                            "displayOn": ""
                        },
                        "score": 0,
                        "lines": [
                            {
                                "name": "titleCharacterEncoding",
                                "text": "Character encoding",
                                "explanation": "HTML and special characters must be properly encoded for consumer-facing display.",
                                "action": {
                                    "value": "Use Amazon's supported character set in the title.",
                                    "displayOn": "red"
                                },
                                "score": {
                                    "max": 5,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "titleLength",
                                "text": "Length",
                                "explanation": "The title (including subtitle and series name) should be fewer than 80 characters long.",
                                "action": {
                                    "value": "Consider a title that is fewer than 80 characters.",
                                    "displayOn": "red"
                                },
                                "range": {
                                    "best": 80,
                                    "worst": 200
                                },
                                "score": {
                                    "max": 10,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }
                        ]
                    },
                    {
                        "name": "descriptionElements",
                        "title": "Description",
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "score": 0,
                        "lines": [
                            {
                                "name": "headline",
                                "text": "Headline",
                                "explanation": "Description should begin with a brief headline to entice potential buyers. The headline should be under 200 characters long, bolded, and followed by a paragraph break.",
                                "action": {
                                    "value": "Begin the Amazon description with a bold-faced headline under 200 characters.",
                                    "displayOn": "red"
                                },
                                "range": {
                                    "best": 34,
                                    "worst": 14
                                },
                                "score": {
                                    "max": 0,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "descriptionLength",
                                "text": "Overall Length",
                                "explanation": "Description should be at least 150 words long and up to a maximum of 4,000 characters.",
                                "action": {
                                    "value": "Consider using 250 words or more in Amazon description.",
                                    "displayOn": "red"
                                },
                                "range": {
                                    "best": 150,
                                    "worst": 50
                                },
                                "score": {
                                    "max": 35,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "paragraphBreaks",
                                "text": "Paragraph breaks",
                                "explanation": "Description should include an intro, an expository section, and a brief closing paragraph. Include at least 2 paragraph breaks.",
                                "action": {
                                    "value": "Consider breaking up description into three or more sections.",
                                    "displayOn": "red"
                                },
                                "score": {
                                    "max": 10,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "descriptionCharacterEncoding",
                                "text": "Character encoding",
                                "explanation": "HTML and special characters must be properly encoded for consumer-facing display.",
                                "action": {
                                    "value": "Use Amazon's supported character set in the description.",
                                    "displayOn": "red"
                                },
                                "score": {
                                    "max": 5,
                                    "min": 0,
                                    "real": 0
                                },
                                "explClass": "smallerText",
                                "class": ""
                            }
                        ]
                    },
                    {
                        "name": "straplineElements",
                        "title": "Strapline",
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "score": 0,
                        "column": 1,
                        "invisible": true,
                        "lines": [
                            {
                                "name": "straplinePresence",
                                "text": "Presence",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "score": {
                                    "max": 10,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "straplineLength",
                                "text": "Length",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "score": {
                                    "max": 10,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "straplineEmphasis",
                                "text": "Emphasis",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "score": {
                                    "max": 15,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }
                        ]
                    }
                ]
            },
            {
                "name": "semanticKeywords",
                "title": "Semantic Analysis",
                "description": "Usage of consumer terms and phrases in product metadata and description",
                "explanation": "",
                "displayOnOQScoreTab":false,
                "action": {
                    "value": "",
                    "displayOn": ""
                },
                "weight": 0,
                "score": 0,
                "hideScore": true,
                "range": {
                    "best": 12,
                    "worst": 6
                },
                "class": "lastColumn",
                "signature": true,
                "signatureUrl": "http://kadaxis.com/",
                "sections": [
                    {
                        "name": "suggestedKeywords",
                        "title": "Suggested Keywords",
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "score": 0,
                        "description": "",
                        "explanation": "Consider using these consumer keywords and phrases in descriptive copy and the retailer (off-page) keywords field.",
                        "lines": []
                    }
                ]
            }
        ]
    },
    {
        "name": "atRetail",
        "title": 'At Retail',
        "url": 'atretail.tpl.html',
        "class": "",
        "displayOnOQScoreTab":true,
        "action": {
            "value": "",
            "displayOn": ""
        },
        "score": 0,
        "range": {
            "best": 75,
            "worst": 40
        },
        "columns": [
            {
                "name": "rankings",
                "title": "Rankings",
                "description": "Product bestseller rank, as well as category and author rank if available",
                "explanation": "",
                "displayOnOQScoreTab":true,
                "action": {
                    "value": "",
                    "displayOn": ""
                },
                "weight": 45,
                "score": 0,
                "range": {
                    "best": 75,
                    "worst": 40
                },
                "class": "firstColumn",
                "sections": [
                    {
                        "name": "salesRank",
                        "title": "Best Sellers Rank",
                        "explanation": "Consider these categories to improve your best sellers rankings.",
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "weight": 70,
                        "score": 0,
                        "oqWeight": 20,
                        "oqResult": "oqScoreProductAuthority",
                        //"oqWeight2": 15,
                        //"oqResult2": "oqScoreBrandAuthority",
                        "lines": [
                            {
                                "name": "salesRankOverall",
                                "text": "Overall",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Sales rank is based on current and historical sales trends. It is a measure of a title's sales track in relation to the sales of other books, not of the units sold.",
                                "range": {
                                    "best": 10002,
                                    "worst": 100000
                                },
                                "score": {
                                    "max": 40,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": "",
                                "percentage": true
                            },
                            {
                                "name": "salesRankCategory1",
                                "text": "Category 1",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "For sales rank, books may appear in up to three categories or subcategories. Sales rank is a measure of a title's current and historical sales track in relation to the sales of other books in that category. ",
                                "range": {
                                    "best": 10002,
                                    "worst": 100000
                                },
                                "score": {
                                    "max": 20,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": "",
                                "percentage": true
                            },
                            {
                                "name": "salesRankCategory2",
                                "text": "Category 2",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "For sales rank, books may appear in up to three categories or subcategories. Sales rank is a measure of a title's current and historical sales track in relation to the sales of other books in that category. ",
                                "range": {
                                    "best": 10002,
                                    "worst": 100000
                                },
                                "score": {
                                    "max": 20,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": "",
                                "percentage": true
                            },
                            {
                                "name": "salesRankCategory3",
                                "text": "Category 3",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "For sales rank, books may appear in up to three categories or subcategories. Sales rank is a measure of a title's current and historical sales track in relation to the sales of other books in that category. ",
                                "range": {
                                    "best": 10002,
                                    "worst": 100000
                                },
                                "score": {
                                    "max": 20,
                                    "min": 0,
                                    "real": 0
                                },
                                "percentage": true,
                                "class": ""
                            },
                            {
                                "name": "authorRankOverall",
                                "text": "Author rank",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Author rank is based on current and historical sales trends for all of an author's books (across formats). It is not an indication of the number of units sold, but is a measure of an author's sales track in relation to the sales for other authors.",
                                "range": {
                                    "best": 10002,
                                    "worst": 100000
                                },
                                "score": {
                                    "max": 0,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }
                        ]
                    },
                    {
                        "name": "suggestedCategories",
                        "title": "Suggested categories",
                        "score": 0,
                        "description": "",
                        "explanation": "These are categories in which consumers are shopping for books like yours.",
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "lines": []
                    },
                    {
                        "name": "authorRank",
                        "title": "Author rank",
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "invisible": true,
                        "score": 0,
                        "weight": 30,
                        "oqWeight": 25,
                        "oqResult": "oqScoreBrandAuthority",
                        "lines": [
                            // {
                            //     "name": "authorRankOverall",
                            //     "text": "Overall",
                            //     "range": {
                            //         "best": 10002,
                            //         "worst": 100000
                            //     },
                            //     "score": {
                            //         "max": 0,
                            //         "min": 0,
                            //         "real": 0
                            //     },
                            //     "class": ""
                            // },
                            {
                                "name": "authorRankCategory1",
                                "text": "Category 1",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "range": {
                                    "best": 10002,
                                    "worst": 100000
                                },
                                "score": {
                                    "max": 50,
                                    "min": 0,
                                    "real": 0
                                },
                                "percentage": true,
                                "class": ""
                            },
                            {
                                "name": "authorRankCategory2",
                                "text": "Category 2",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "range": {
                                    "best": 10002,
                                    "worst": 100000
                                },
                                "score": {
                                    "max": 25,
                                    "min": 0,
                                    "real": 0
                                },
                                "percentage": true,
                                "class": ""
                            },
                            {
                                "name": "authorRankCategory3",
                                "text": "Category 3",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "range": {
                                    "best": 10002,
                                    "worst": 100000
                                },
                                "score": {
                                    "max": 25,
                                    "min": 0,
                                    "real": 0
                                },
                                "percentage": true,
                                "class": ""
                            }
                        ]
                    },
                ]
            },
            {
                "name": "priceAvailability",
                "title": "Price & Availability",
                "description": "Consumer-facing pricing, fulfillment and special program eligibility",
                "explanation": "",
                "displayOnOQScoreTab":true,
                "action": {
                    "value": "",
                    "displayOn": ""
                },
                "score": 0,
                "oqWeight": 5,
                "oqResult": "oqScoreProductAuthority",
                "weight": 25,
                "range": {
                    "best": 75,
                    "worst": 40
                },
                "class": "secondColumn",
                "sections": [
                    {
                        "name": "priceElements",
                        "title": "Displayed Pricing",
                        "score": 0,
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "lines": [
                            {
                                "name": "discounting",
                                "text": "Discount",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Potential buyers want to see that they are getting a deal and saving money on their purchase.",
                                "score": {
                                    "max": 25,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "discountPercentage",
                                "text": "Discount percentage",
                                "action": {
                                    "value": "With this consumer-friendly discount, consider promotion.",
                                    "displayOn": "green"
                                },
                                "explanation": "A displayed discount percentage greater than 25% is optimal in most cases.",
                                "score": {
                                    "max": 50,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }
                        ]
                    },
                    {
                        "name": "availabilityElements",
                        "title": "Availability",
                        "column": 4,
                        "score": 0,
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "lines": [
                            {
                                "name": "inStock",
                                "text": "In stock/Available",
                                "value": "",
                                "displayValue": "",
                                "action": {
                                    "value": "Make sure the title is in stock at Amazon.",
                                    "displayOn": "red"
                                },
                                "explanation": 'Titles should always be available for purchase. (Note: Print-on-demand titles typically appear as "In Stock".)',
                                "score": {
                                    "max": 25,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            // {
                            //     "name": "soldByAmazon",
                            //     "text": "Sold by Amazon",
                            //     "explanation": "All selling functions, including the price paid by the consumer, performed by Amazon, not third-parties. Note: this does not refer to Amazon-produced items.",
                            //     "range": {
                            //         "best": 0,
                            //         "worst": -1
                            //     },
                            //     "value": "",
                            //     "displayValue": "",
                            //     "vx": true,
                            //     "score": {
                            //         "max": 10,
                            //         "min": 0,
                            //         "real": 0
                            //     },
                            //     "class": ""
                            // },
                            // {
                            //     "name": "fulfilledByAmazon",
                            //     "text": "Fulfilled by Amazon",
                            //     "explanation": "Item is fulfilled by Amazon on behalf of third-party sellers, who keep the item in Amazon's warehouses and allow Amazon to pack and ship.",
                            //     "value": "",
                            //     "displayValue": "",
                            //     "score": {
                            //         "max": 10,
                            //         "min": 0,
                            //         "real": 0
                            //     },
                            //     "class": ""
                            // },
                            // {
                            //     "name": "eligibleForPrime",
                            //     "text": "Eligible for Prime",
                            //     "explanation": "Item is offered with the benefits of Amazon Prime, such as free two-day shipping and the ability to borrow books from the Kindle Owners' Lending Library.",
                            //     "value": "",
                            //     "displayValue": "",
                            //     "score": {
                            //         "max": 10,
                            //         "min": 0,
                            //         "real": 0
                            //     },
                            //     "class": ""
                            // },
                            /*{
                                "name": "eligibleForKindleUnlimited",
                                "text": "Eligible for Kindle Unlimited",
                                "explanation": "Item is available for reading by Kindle Unlimited subscribers.",
                                "action": {
                                    "value": "Inclusion in Kindle unlimited may positively affect ranking.",
                                    "displayOn": "red"
                                },
                                "value": "",
                                "displayValue": "",
                                "score": {
                                    "max": 10,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }*/
                        ]
                    }
                ]
            },
            {
                "name": "customerReviews",
                "title": "Consumer Reviews",
                "description": "Reviews and ratings submitted by consumers",
                "explanation": "",
                "displayOnOQScoreTab":true,
                "action": {
                    "value": "",
                    "displayOn": ""
                },
                "weight": 20,
                "oqWeight": 15,
                "oqResult": "oqScoreProductAuthority",
                //"oqWeight2": 10,
                //"oqResult2": "oqScoreBrandAuthority",
                "score": 0,
                "range": {
                    "best": 75,
                    "worst": 40
                },
                "class": "halfColumn",
                "sections": [
                    {
                        "name": "reviewsAndRatings",
                        "title": "Reviews & Ratings",
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "score": 0,
                        "lines": [
                            {
                                "name": "numberOfReviews",
                                "text": "Number of reviews",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Books should have as many legitimate customer reviews as possible. Encourage readers to submit reviews. Reviews may be submitted regardless of where or how a book was read.",
                                "range": {
                                    "best": 25,
                                    "worst": 3
                                },
                                "score": {
                                    "max": 50,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": "",
                                "percentage": true
                            },
                            {
                                "name": "starRating",
                                "text": "Star rating",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Average customer rating should be 4 stars and up.",
                                "range": {
                                    "best": 3.5,
                                    "worst": 1.91
                                },
                                "score": {
                                    "max": 50,
                                    "min": 0,
                                    "real": 0
                                },
                                "onePercent": 0.05,
                                "percentage": true,
                                "class": ""
                            }
                        ]
                    }
                ]
            },
            {
                "name": "authorPage",
                "title": "Author Page",
                "description": "Completion of a stand-alone Amazon Author Page",
                "explanation": "",
                "displayOnOQScoreTab":true,
                "action": {
                    "value": "",
                    "displayOn": ""
                },
                "weight": 10,
                "oqWeight": 10,
                "oqResult": "oqScoreBrandAuthority",
                "score": 0,
                "range": {
                    "best": 75,
                    "worst": 40
                },
                "class": "halfColumn",
                "sections": [
                    {
                        "name": "authorPageElements",
                        "title": "Key elements",
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "score": 0,
                        "lines": [
                            {
                                "name": "authorPagePresence",
                                "text": "Presence",
                                "redText": "No Author Page Found",
                                "action": {
                                    "value": "Create an Amazon Author Central page.",
                                    "displayOn": "red"
                                },
                                "explanation": "No Author Page found: Create an Amazon Author Central account and complete the author profile as completely as possible. Include a rich author biography and a recent, high-quality author photo. Ensure that the author is connected to all of his or her works.",
                                "score": {
                                    "max": 30,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "authorPageBio",
                                "text": "Author Bio",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Include a rich author biography of at least 100 characters.",
                                "score": {
                                    "max": 35,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "authorPageImage",
                                "text": "Image",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Upload a high-quality photo of the author.",
                                "score": {
                                    "max": 35,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "webSocial",
        "title": 'Web & Social',
        "url": 'webnsocial.tpl.html',
        "class": "",
        "displayOnOQScoreTab":true,
        "action": {
            "value": "",
            "displayOn": ""
        },
        "score": 0,
        "range": {
            "best": 75,
            "worst": 40
        },
        "columns":[
            {
                "name": "goodreadsTitle",
                "title": "Goodreads Title",
                "action": {
                    "value": "",
                    "displayOn": ""
                },
                "displayOnOQScoreTab":true,
                "description": "Marketing content, assets, and reader engagement metrics around title",
                //"explanation": "Marketing content, assets, and reader engagement metrics around the book.",
                "weight": 50,
                "score": 0,
                "oqWeight": 35,
                "oqResult": "oqScoreProductAuthority",
                "range": {
                    "best": 75,
                    "worst": 40
                },
                "class": "firstColumn",
                "sections": [
                    {
                        "name": "grTitleKeyElements",
                        "title": "Key elements",
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "score": 0,
                        "lines": [
                            {
                                "name": "grTitleListing",
                                "text": "Title listing",
                                "action": {
                                    "value": "Make sure the Goodreads title page is complete.",
                                    "displayOn": "red"
                                },
                                "explanation": "No book page found: Ensure that the title is listed on Goodreads. (Note: different formats and editions are listed separately and then rolled-up into a single parent listing.)",
                                "score": {
                                    "max": 20,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "grTitleDescription",
                                "text": "Description",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Include a detailed description of the book. It can and should be different than the description on Amazon.",
                                "score": {
                                    "max": 5,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "grTitleCover",
                                "text": "Cover",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Upload a high-quality, legible cover image.",
                                "score": {
                                    "max": 5,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }
                            /*,
                            {
                                "name": "grTitleOtherMedia",
                                "text": "Other media",
                                "explanation": "Upload additional photos and videos of and about the book.",
                                "score": {
                                    "max": 5,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }*/
                        ]
                    },
                    {
                        "name": "grReviewsRatings",
                        "title": "Reviews & ratings",
                        "score": 0,
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "lines": [
                            {
                                "name": "grTitleStarRating",
                                "text": "Star rating",
                                "explanation": "Average customer rating should be 4 stars and up.",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "range": {
                                    "best": 3.5,
                                    "worst": 1.9
                                },
                                "score": {
                                    "max": 15,
                                    "min": 0,
                                    "real": 0
                                },
                                /*"oqWeight": 5,
                                "oqResult": "oqScoreProductAuthority",
                                "oqWeight2": 10,
                                "oqResult2": "oqScoreBrandAuthority",*/
                                "class": "",
                                "onePercent": 0.05,
                                "percentage": true
                            },
                            {
                                "name": "grTitleNumberOfRantings",
                                "text": "Number of ratings",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Books should have as many legitimate and positive customer reviews and ratings as possible. Encourage readers to submit reviews on Goodreads.",
                                "range": {
                                    "best": 2500,
                                    "worst": 50
                                },
                                "value": "",
                                "displayValue": "",
                                "score": {
                                    "max": 15,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": "",
                                "explClass": "upper",
                                /*"oqWeight": 5,
                                "oqResult": "oqScoreProductAuthority",
                                "oqWeight2": 10,
                                "oqResult2": "oqScoreBrandAuthority",*/
                                "percentage": true
                            },
                            {
                                "name": "grTitleNumberOfReviews",
                                "text": "Number of reviews",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Books should have as many legitimate and positive customer reviews and ratings as possible. Encourage readers to submit reviews on Goodreads.",
                                "range": {
                                    "best": 300,
                                    "worst": 10
                                },
                                "value": "",
                                "displayValue": "",
                                "score": {
                                    "max": 15,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": "",
                                "explClass": "upper",
                                /*"oqWeight": 5,
                                "oqResult": "oqScoreProductAuthority",
                                "oqWeight2": 10,
                                "oqResult2": "oqScoreBrandAuthority",*/
                                "percentage": true
                            }
                        ]
                    },
                    {
                        "name": "grActivity",
                        "title": "Activity",
                        "score": 0,
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "lines": [
                            {
                                "name": "grToReadCount",
                                "text": "To-read count",
                                "action": {
                                    "value": "Based on the number of people who want to read this book, consider a promotion.",
                                    "displayOn": "green"
                                },
                                "explanation" : "Ideally, authors should have more than 100 followers. Engage with readers.",
                                "range": {
                                    "best": 500,
                                    "worst": 20
                                },
                                "value": "",
                                "displayValue": "",
                                "score": {
                                    "max": 15,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": "",
                                //"oqWeight": 10,
                                //"oqResult": "oqScoreProductAuthority",
                                "percentage": true
                            },
                            {
                                "name": "grCurrentlyReadingCount",
                                "text": "Currently-reading count",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Authors should have as many customer reviews and rating as possible. Encourage readers to submit reviews on Goodreads.",
                                "range": {
                                    "best": 500,
                                    "worst": 20
                                },
                                "score": {
                                    "max": 10,
                                    "min": 0,
                                    "real": 0
                                },
                                "explClass": "upper2",
                                "class": ""
                            }
                        ]
                    }
                ]
            },
            {
                "name": "goodreadsAuthor",
                "title": "Goodreads Author",
                "addText": "",
                "displayOnOQScoreTab":true,
                "action": {
                    "value": "",
                    "displayOn": ""
                },
                "description": "Marketing content, assets, and reader engagement metrics around author",
                //"explanation": "Marketing content, assets, and reader engagement metrics around the author.",
                "weight": 35,
                "oqWeight": 50,
                "oqResult": "oqScoreBrandAuthority",
                "score": 0,
                "range": {
                    "best": 75,
                    "worst": 40
                },
                "class": "secondColumn",
                "explClass": "",
                "sections": [
                    {
                        "name": "grTitleKeyElements",
                        "title": "Key elements",
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "score": 0,
                        "lines": [
                            {
                                "name": "grAuthorListing",
                                "text": "Author listing",
                                "action": {
                                    "value": "Make sure the Goodreads author page is complete.",
                                    "displayOn": "red"
                                },
                                "explanation": "No author page found: Create a Goodreads Author account and complete the author profile as completely as possible. Include a rich author biography, a recent author photo, and links to the author's other web presences. Ensure that the author is connected to all of his or her works.",
                                "score": {
                                    "max": 25,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "grAuthorBio",
                                "text": "Author bio",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Include a rich author biography.",
                                "score": {
                                    "max": 5,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "grAuthorPhoto",
                                "text": "Photo",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Upload a high-quality photo of the author.",
                                "score": {
                                    "max": 5,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }
                            /*,{
                                "name": "grWebsiteLink",
                                "text": "Website link",
                                "explanation": "Include a link the author's primary website. (This may be a social profile or detail page on another site if the author does not have a website.)",
                                "score": {
                                    "max": 10,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "grTwitterLink",
                                "text": "Twitter link",
                                "explanation": "Include a link the author's Twitter profile, if available.",
                                "score": {
                                    "max": 10,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "grAuthorOtherMedia",
                                "text": "Other media",
                                "explanation": "Upload additional photos and videos of and/or about the author.",
                                "score": {
                                    "max": 10,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }*/
                        ]
                    },
                    {
                        "name": "grReviewsRatings",
                        "title": "Audience",
                        "score": 0,
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "lines": [
                            {
                                "name": "grAuthorFollowerCount",
                                "text": "Follower count",
                                "action": {
                                    "value": "Based on high current author popularity, consider a promotion.",
                                    "displayOn": "green"
                                },
                                "explanation" : "Ideally, authors should have as many followers as possible. Engage with readers.",
                                "range": {
                                    "best": 200,
                                    "worst": 10
                                },
                                "value": "",
                                "displayValue": "",
                                "score": {
                                    "max": 10,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": "",
                                //"oqWeight": 10,
                                //"oqResult": "oqScoreProductAuthority",
                                "percentage": true
                            },
                            {
                                "name": "grAuthorStarRating",
                                "text": "Star rating",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Average customer rating should be 4 stars and up. Note: all reviews must  be legitimate.",
                                "range": {
                                    "best": 3.5,
                                    "worst": 1.9 //1.91
                                },
                                "value": "",
                                "displayValue": "",
                                "score": {
                                    "max": 20,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "grAuthorNumberOfReviews",
                                "text": "Number of reviews",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Authors should have as many customer reviews and rating as possible. Encourage readers to submit reviews on Goodreads.",
                                "range": {
                                    "best": 1000,
                                    "worst": 25
                                },
                                "value": "",
                                "displayValue": "",
                                "score": {
                                    "max": 15,
                                    "min": 0,
                                    "real": 0
                                },
                                "explClass": "upper",
                                "class": ""
                            },
                            {
                                "name": "grAuthorNumberOfRatings",
                                "text": "Number of ratings",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation": "Authors should have as many customer reviews and rating as possible. Encourage readers to submit reviews on Goodreads.",
                                "range": {
                                    "best": 7000,
                                    "worst": 150
                                },
                                "score": {
                                    "max": 20,
                                    "min": 0,
                                    "real": 0
                                },
                                "explClass": "upper2",
                                "class": ""
                            }
                        ]
                    }
                ]
            },
            {
                "name": "socialActivity",
                "title": "Activity & Engagement",
                "action": {
                    "value": "",
                    "displayOn": ""
                },
                "displayOnOQScoreTab":true,
                "description": "Sharing, mentions, and traffic indicators for product page, title, and author",
                //"explanation": "Social sharing and mentions for title and author",
                "weight": 15,
                "oqWeight": 10,
                "oqResult": "oqScoreProductAuthority",
                "score": 0,
                "range": {
                    "best": 75,
                    "worst": 40
                },
                "class": "lastColumn",
                "sections": [
                    {
                        "name": "socialSharings",
                        "title": "Key Channels",
                        "action": {
                            "value": "",
                            "displayOn": ""
                        },
                        "score": 0,
                        "weight": 100,
                        /*"oqWeight": 5,
                        "oqResult": "oqScoreProductAuthority",
                        "oqWeight2": 5,
                        "oqResult2": "oqScoreBrandAuthority",*/
                        "lines": [
                            {
                                "name": "fbShareCount",
                                "text": "Facebook",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation" : "Life-to-date shares, comments, likes of the product detail page. Strong engagement with positive sentiment is ideal. Include link to the product page in social updates without, of course, creating spam.",
                                "range": {
                                    "best": 250,
                                    "worst": 25
                                },
                                "score": {
                                    "max": 35,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "twtTweets",
                                "text": "Twitter",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation" : "Trailing 7 day mentions of author or title with a link to product detail page. Strong engagement with positive sentiment is ideal. Include link to the product page in social updates without, of course, creating spam.",
                                "range": {
                                    "best": 10,
                                    "worst": 1
                                },
                                "score": {
                                    "max": 25,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "wikiPageViews",
                                "text": "Wikipedia",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation" : "Wikipedia page views for the current calendar month",
                                "oqWeight": 10,
                                "oqResult": "oqScoreBrandAuthority",
                                "range": {
                                    "best": 20000,
                                    "worst": 1000
                                },
                                "score": {
                                    "max": 40,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }
                            /*, {
                                "name": "hasOfficialWebsite",
                                "text": "Official Website",
                                "action": {
                                    "value": "",
                                    "displayOn": ""
                                },
                                "explanation" : "Indicates that the author has, or does not have, an official website",
                                "score": {
                                    "max": 0,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }*/
                            /*,{
                                "name": "googleRatingsCount",
                                "text": "Google Ratings Count",
                                "action": {
                                     "value": "",
                                     "displayOn": ""
                                 },
                                "explanation" : "Strong engagement with positive sentiment is ideal. Including a link to a product page in social updates without, of course, creating spam.",
                                "range": {
                                    "best": 0,
                                    "worst": 0
                                },
                                "score": {
                                    "max": 0,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            },
                            {
                                "name": "googleAverageRating",
                                "text": "Google Average Rating",
                                "action": {
                                     "value": "",
                                     "displayOn": ""
                                 },
                                "explanation" : "Strong engagement with positive sentiment is ideal. Including a link to a product page in social updates without, of course, creating spam.",
                                "range": {
                                    "best": 0,
                                    "worst": 0
                                },
                                "score": {
                                    "max": 0,
                                    "min": 0,
                                    "real": 0
                                },
                                "class": ""
                            }*/
                        ]
                    }
                ]
            }
        ]
    },
    {
        "name": "competition",
        "title": 'Competition',
        "url": 'competitions.tpl.html',
        "class": "last",
        "displayOnOQScoreTab":false,
        "score": 0,
        "columns": []
    }
];

