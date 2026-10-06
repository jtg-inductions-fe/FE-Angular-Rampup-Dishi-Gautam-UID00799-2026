export const ARTICLE_FORM_FIELDS = {
    title: 'title',
    description: 'description',
    shortDescription: 'shortDescription',
    image: 'image',
    tags: 'tags',
    tagInput: 'tagInput',
} as const;

export const ARTICLE_FORM_CONFIG = {
    title: {
        type: 'text',
        placeholder: 'Enter article title',
    },
    shortDescription: {
        type: 'text',
        placeholder: 'Write a short description',
    },
    tagInput: {
        type: 'text',
        placeholder: 'Enter a tag',
    },
    image: {
        id: 'article-image',
        type: 'file',
        accept: 'image/*',
    },
} as const;

export const ARTICLE_EDITOR_MODULES = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        [{ header: [1, 2, 3, false] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'blockquote', 'code-block'],
    ],
} as const;

export const ARTICLE_FORM_LIMITS = {
    titleMaxLength: 200,
    shortDescriptionMaxLength: 160,
    descriptionMinLength: 1,
    descriptionMaxLength: 10000,
    tagsMinLength: 1,
    tagsMaxLength: 10,
} as const;

export const ARTICLE_TEXT_REGEX = {
    nonBreakingSpace: /(?:\u00a0|&nbsp;)/gi,
    whitespace: /\s+/g,
} as const;
