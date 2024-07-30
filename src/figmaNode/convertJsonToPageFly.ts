import { v4 as uuidv4 } from 'uuid';

type CssObject = {
    [key: string]: string;
};

type FormattedCssJson = {
    all: {
        '&': string;
    };
};
const dataPageFly = {
    "customJS": "",
    "customCSS": "",
    "pageflyVersion": "4.13.3",
    "items": [
        {
            "__v": 0,
            "children": [
                "715e638c-3443-42de-9e9c-5ee506c93b10"
            ],
            "createdAt": "2024-07-23T08:09:57.719Z",
            "styles": [],
            "type": "Body",
            "updatedAt": "2024-07-25T02:10:28.902Z",
            "id": "06715e63-8c34-4392-9ede-9c5ee506c93b"
        },
        {
            "__v": 0,
            "children": [],
            "createdAt": "2024-07-23T08:09:57.718Z",
            "styles": [],
            "type": "Layout",
            "updatedAt": "2024-07-25T02:10:28.902Z",
            "id": "715e638c-3443-42de-9e9c-5ee506c93b10"
        },
    ],
    "styles": [
        {
            "__v": 0,
            "createdAt": "2024-07-23T08:09:57.719Z",
            "styles": "{\"all\":{\"&\":\"background-color: rgb(250, 241, 236); padding-bottom: 80px; padding-top: 0px;\"},\"mobile\":{\"&\":\"padding-bottom: 8px;\"}}",
            "type": "Body",
            "updatedAt": "2024-07-25T02:10:28.902Z",
            "id": "06715e63-8c34-4392-9ede-9c5ee506c93b"
        },
        {
            "__v": 0,
            "createdAt": "2024-07-23T08:09:57.719Z",
            "styles": "{\"all\":{\"&\":\"background-color: rgb(250, 241, 236); padding-bottom: 80px; padding-top: 0px;\"},\"mobile\":{\"&\":\"padding-bottom: 8px;\"}}",
            "type": "Layout",
            "updatedAt": "2024-07-25T02:10:28.902Z",
            "id": "715e638c-3443-42de-9e9c-5ee506c93b10"
        },
    ],
    "type": "page",
    "globalSectionData": []
}

function formatCssObject(cssObject: CssObject): string {
    const cssJson: any = { all: {} };
    const cssRules: string[] = [];

    if (cssObject) {
        for (const [property, value] of Object.entries(cssObject)) {
            cssRules.push(`${property}: ${value}`);
        }
    }

    cssJson.all['&'] = cssRules.join('; ');
    return JSON.stringify(cssJson, null, 2); // formatted JSON with indentation
}

function addCssToSection(cssObject: CssObject, deepCount: number): CssObject {
    if (deepCount === 1) {
        const directionLayout = cssObject.display === 'flex' && cssObject['flex-direction'] === 'column'
        return {
            ...cssObject,
            '--pf-flex-layout-direction': directionLayout ? 'vertical' : 'horizontal',
            'flex-flow': directionLayout ? 'column' : 'row'
        }
    }
    return cssObject
}

export const jsonData: any = []

export const appendJsonDataToPageFlly = () => {
    dataPageFly.items[1].children.push(jsonData[0].id)
    jsonData.forEach((data: any) => {
        dataPageFly.items.push({
            "__v": 0,
            "children": data.children,
            "createdAt": "2024-07-23T08:09:57.719Z",
            "styles": [],
            ...data.data ? { data: data.data } : {},
            "type": data.type,
            "updatedAt": "2024-07-25T02:10:28.902Z",
            "id": data.id
        })
        dataPageFly.styles.push({
            "__v": 0,
            "createdAt": "2024-07-23T08:09:57.719Z",
            "styles": data.css,
            "type": data.type,
            "updatedAt": "2024-07-25T02:10:28.902Z",
            "id": data.id
        })
    })
    const element = document.createElement("a");
    const textFile = new Blob([JSON.stringify(dataPageFly)], { type: 'text/plain' }); //pass data from localStorage API to blob
    element.href = URL.createObjectURL(textFile);
    element.download = "abc.json";
    document.body.appendChild(element);
    element.click();
}

export const convertJsonToPageFly = (data: any, deepCount: number, parent: any = []) => {
    const deep = deepCount + 1;

    const t: any = {
        "__v": 0,
        "children": [],
        "createdAt": "2024-07-23T08:09:57.719Z",
        "styles": [],
        "updatedAt": "2024-07-25T02:10:28.902Z",
        "id": uuidv4(),
        "css": formatCssObject(data?.isText ? {
            margin: "0px",
            ...addCssToSection(data.css, deepCount)
        } : addCssToSection(data.css, deepCount)),
        "name": data.name,
    };

    jsonData.push(t);
    parent.push(t.id);

    if (deepCount === 1) {
        t.type = 'FlexSection';
    } else {

        t.type = (data.children && data.children.length > 0 ? 'FlexBlock' : (data.isText ? 'Heading2' : 'Image4'));
        if (data.isText) {
            t.data = {
                "editable": true,
                "placeholder": "Enter text...",
                "value": data?.textCharacters || "",
                "classGlobalStyling": "pf-heading-1-h3"
            };
        }
    }

    if (data.children) {
        data.children.forEach((child: any) => {
            convertJsonToPageFly(child, deep, t.children);
        });
    }
};
