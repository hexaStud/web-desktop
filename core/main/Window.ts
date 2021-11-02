export class Window {
    private static processID: number = 0;
    private id: number;
    private frame: HTMLElement | undefined;


    public constructor() {
        this.id = Window.processID;
        Window.processID++;
        this.frame = undefined;
    }

    private draggable(header: HTMLElement): void {
        let pos1: number, pos2: number, pos3: number, pos4: number;
        pos1 = pos2 = pos3 = pos4 = 0;

        header.addEventListener("mousedown", (e) => {
            e.preventDefault();

            pos3 = e.clientX;
            pos4 = e.clientY;

            const up = (e: MouseEvent) => {
                e.preventDefault();
                header.removeEventListener("mouseup", up);
                header.removeEventListener("mousemove", move);
            }

            const move = (e: MouseEvent) => {
                e.preventDefault();

                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                if (!!this.frame) {
                    this.frame.style.left = (this.frame.offsetLeft - pos1) + "px";
                    this.frame.style.top = (this.frame.offsetTop - pos2) + "px";
                }
            }

            header.addEventListener("mouseup", up);
            header.addEventListener("mousemove", move);
        });
    }

    public open() {
        this.frame = document.createElement("div");
        this.frame.classList.add("window");
        this.frame.addEventListener("mousedown", () => {
            let elements = document.getElementsByClassName(".window");
            for (let i = 0; i < elements.length; i++) {
                elements[i].classList.remove("active");
            }
            if (!!this.frame) {
                this.frame.classList.add("active");
            }
        });
        let navbar = document.createElement("div");
        navbar.classList.add("navbar")

        let closeBTN = document.createElement("div");
        closeBTN.classList.add("icon");
        let closeBTNSpan = document.createElement("span");
        closeBTNSpan.innerHTML = "x";

        let maximizeBTN = document.createElement("div");
        maximizeBTN.classList.add("icon");
        let maximizeBTNSpan = document.createElement("span");
        maximizeBTNSpan.innerHTML = "[]"; // TODO add icon;
        maximizeBTNSpan.addEventListener("click", () => {
            if (!!this.frame) {
                this.frame.classList.toggle("maximized");
            }
        });

        let content = document.createElement("div");
        content.classList.add("content");
        content.appendChild(document.createElement("iframe"));

        maximizeBTN.appendChild(maximizeBTNSpan);
        closeBTN.appendChild(closeBTNSpan);

        navbar.appendChild(maximizeBTN);
        navbar.appendChild(closeBTN);

        this.frame.appendChild(navbar);
        this.frame.appendChild(content);

        this.draggable(navbar);

        document.body.appendChild(this.frame);
        this.frame.style.top = ((window.innerHeight - this.frame.clientHeight) / 2) + "px";
        this.frame.style.left = ((window.innerWidth - this.frame.clientWidth) / 2) + "px";
    }

    public close() {
        if (!!this.frame) {
            this.frame.remove();
            this.frame = undefined;
        }
    }
}
