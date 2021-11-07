export declare namespace Assets {
    class Sound {
        private file;
        private audio;
        private constructor();
        play(): void;
        static get(name: string): Sound | false;
    }
    class Image {
        private file;
        private constructor();
        getPath(): string;
        static get(name: string): Image | false;
    }
}
//# sourceMappingURL=Assets.d.ts.map