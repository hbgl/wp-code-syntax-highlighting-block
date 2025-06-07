<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

function cshb_manifest(): CshbManifest {
    static $manifest = null;
    if ($manifest === null) {
        $data = require __DIR__ . '/generated/manifest.generated.php';
        $manifest = CshbManifest::fromArray($data);
    }
    return $manifest;
}

final readonly class CshbManifest {
    /**
     * @param list<string> $themes
     * @param list<string> $languages
     */
    public function __construct(
        public array $themes,
        public array $languages,
    ) {
    }

    public static function fromArray(array $array): self
    {
        $themes = $array['themes'] ?? [];
        if (! is_array($themes)) {
            $themes = [];
        }
        $themes = array_values(array_filter($themes, 'is_string'));

        $languages = $array['languages'] ?? [];
        if (! is_array($languages)) {
            $languages = [];
        }
        $languages = array_values(array_filter($languages, 'is_string'));

        return new self($themes, $languages);
    }
}