// Name: Test Runner
// ID: gceTestRunner
// Description: A testing framework for PenguinMod: Test that blocks behave as expected. Provides good error messages and error traceback.
// By: GermanCodeEngineer <https://github.com/GermanCodeEngineer/>
// License: MIT
// Made for PenguinMod

(/** @param {ScratchObject} Scratch */ (Scratch) => {
"use strict"

/**
 * Allow importing this file in a non-Scratch testing environment.
 * When the extension is imported in PenguinMod this is always true
 */
const isRuntimeEnv = !Scratch.extensions.isTestingEnv
if (isRuntimeEnv && !Scratch.extensions.unsandboxed) {
    throw new Error("Test Runner Extension must run unsandboxed.")
}

const {BlockType, ArgumentType, Cast} = Scratch

/**
 * @param {string} s
 * @returns {string}
 */
function quote(s) {
    s = Cast.toString(s)
    s = s.replace(/\\/g, "\\\\").replace(/'/g, "\\'")
    return `'${s}'`
}

class TestError extends Error {
    /**
     * @param {string} message
     * @param {{cause?: *, actualMessage?: ?string, scopePrefix?: ?string}} [options]
     */
    constructor (message, options = {}) {
        super(message, options)
        this.name = "TestError"
        // Full message like a normal error has
        this.fullMessage = message
        // The actual error message (excludes prefixes)
        this.actualMessage = options.actualMessage || null
        // The scope prefixes (e.g., 'test scope "scope name":')
        this.scopePrefix = options.scopePrefix || null
    }

    /**
     * @param {*} error
     * @returns {string}
     */
    static getActualErrorMessage(error) {
        if (error instanceof TestError && error.actualMessage) {
            return error.actualMessage
        }
        if (error instanceof Error) {
            return error.message
        }
        return String(error)
    }

    /**
     * @param {*} error
     * @param {string} substring
     * @returns {boolean}
     */
    static errorContainsMsg(error, substring) {
        if (!substring) return true
        const message = TestError.getActualErrorMessage(error)
        return message.toLowerCase().includes(substring.toLowerCase())
    }

    /**
     * @param {?string} fallback
     * @param {*} cause
     * @returns {?string}
     */
    static preserveActualMessage(fallback, cause) {
        if (fallback !== null && fallback !== undefined) {
            return fallback
        }
        if (cause instanceof TestError && cause.actualMessage) {
            return cause.actualMessage
        }
        return null
    }
}


class TypeChecker {
    // All custom types (using `customId`) in PM (you can access most from a reporter)
    // (PenguinMod-Vm, PenguinMod-ExtensionsGallery, SharkPools-Extensions) (as of 14.04.2026)
    // agBuffer (AndrewGaming587)
    // agBufferPointer (AndrewGaming587)
    // canvasData (RedMan13)
    // ddeDateFormat (ddededodediamante)
    // ddeDateFormatV2 (ddededodediamante)
    // divEffect (Div)
    // divIterator (Div)
    // dogeiscutObject (DogeisCut)
    // dogeiscutRegularExpression (DogeisCut)
    // dogeiscutSet (DogeisCut)
    // externaltimer (steve0greatness)
    // jwArray (jwklong)
    // jwColor (jwklong)
    // jwDate (jwklong)
    // jwLambda (jwklong)
    // jwNum (jwklong)
    // jwTarget (jwklong)
    // jwVector (jwklong)
    // jwXML (jwklong)
    // paintUtilsColour (Fruits555000)

    static is_agBuffer = TypeChecker._createVMTypeCheck("agBuffer")
    static is_agBufferPointer = TypeChecker._createVMTypeCheck("agBuffer", "PointerType")

    /**
     * @param {*} value
     * @returns {boolean}
     */
    static is_canvasData(value) {
        TypeChecker._assertRuntimeEnv()
        if (!runtime._extensionVariables) return false
        const type = runtime._extensionVariables.canvas
        if (!type) return false
        return value instanceof type
    }

    /**
     * @param {*} value
     * @returns {boolean}
     */
    static is_ddeDateFormat(value) {
        TypeChecker._assertRuntimeEnv()
        if (runtime.ext_ddeDateFormat) {
            try {
                const dateType = Object.getPrototypeOf(runtime.ext_ddeDateFormat.currentDate()).constructor
                if (value instanceof dateType) return true
            } catch {}
        }
    }

    /**
     * @param {*} value
     * @returns {boolean}
     */
    static is_ddeDateFormatV2(value) {
        TypeChecker._assertRuntimeEnv()
        if (runtime.ext_ddeDateFormatV2) {
            try {
                const dateType = Object.getPrototypeOf(runtime.ext_ddeDateFormatV2.currentDate()).constructor
                if (value instanceof dateType) return true
            } catch {}
        }
        return false
    }

    static is_divEffect = TypeChecker._createVMTypeCheck("divAlgEffects", "Effect")
    static is_divIterator = TypeChecker._createVMTypeCheck("divIterator")
    static is_dogeiscutObject = TypeChecker._createVMTypeCheck("dogeiscutObject", null, "Object extension was not loaded properly.")
    static is_dogeiscutRegularExpression = TypeChecker._createVMTypeCheck("dogeiscutRegularExpression")
    static is_dogeiscutSet = TypeChecker._createVMTypeCheck("dogeiscutSet")

    /**
     * @param {*} value
     * @returns {boolean}
     */
    static is_externaltimer(value) {
        TypeChecker._assertRuntimeEnv()
        if (!runtime._extensionVariables) return false
        const type = runtime._extensionVariables.externaltimer
        if (!type) return false
        return value instanceof type
    }

    static is_jwArray = TypeChecker._createVMTypeCheck("jwArray", null, "Array extension was not loaded properly.")
    static is_jwColor = TypeChecker._createVMTypeCheck("jwColor")
    static is_jwDate = TypeChecker._createVMTypeCheck("jwDate")
    static is_jwLambda = TypeChecker._createVMTypeCheck("jwLambda")
    static is_jwNum = TypeChecker._createVMTypeCheck("jwNum")
    static is_jwTarget = TypeChecker._createVMTypeCheck("jwTargets")
    static is_jwVector = TypeChecker._createVMTypeCheck("jwVector")
    static is_jwXML = TypeChecker._createVMTypeCheck("jwXML")

    /**
     * @param {*} value
     * @returns {boolean}
     */
    static is_paintUtilsColour(value) {
        TypeChecker._assertRuntimeEnv()
        try {
            const proto = Object.getPrototypeOf(runtime.ext_fruitsPaintUtils.getColour({COLOUR_NAME: "orange"})).constructor
            return value instanceof proto
        } catch {
            return false
        }
    }



    static _assertRuntimeEnv() {
        if (!isRuntimeEnv) {
            throw new Error("Type checking for extension types is not available in a non-runtime environment.")
        }
    }

    /**
     * @param {string} typeId
     * @param {?string} [overrideTypeProperty]
     * @param {?string} [errMsg] - optional error message if type missing
     * @returns {(value: *) => boolean}
     */
    static _createVMTypeCheck(typeId, overrideTypeProperty = null, typeMissingErrorMsg = null) {
        return function isType(value) {
            if (!isRuntimeEnv) return false
            const typeInfo = Scratch.vm[typeId]
            if (!typeInfo) {
                if (typeMissingErrorMsg) throw new Error(typeMissingErrorMsg)
                return false
            }

            let typeClass
            try {
                typeClass = overrideTypeProperty ? typeInfo[overrideTypeProperty] : typeInfo.Type
            } catch {
                if (typeMissingErrorMsg) throw new Error(typeMissingErrorMsg)
                return false
            }
            return value instanceof typeClass
        }
    }

    /**
     * @param {*} value
     * @returns {string}
     */
    static stringTypeof(value) {
        // Common/Safe JS data types
        if (value === undefined) return "JavaScript Undefined"
        if (value === null) return "JavaScript Null"
        if (typeof value === "boolean") return "Boolean"
        if (typeof value === "number") return "Number"
        if (typeof value === "string") return "String"

        // Custom Extension Types
        if (TypeChecker.is_agBuffer(value)) return "Buffer (AndrewGaming587)"
        if (TypeChecker.is_agBufferPointer(value)) return "Buffer Pointer (AndrewGaming587)"
        if (TypeChecker.is_ddeDateFormat(value)) return "Date (Old Version) (ddededodediamante)"
        if (TypeChecker.is_ddeDateFormatV2(value)) return "Date (ddededodediamante)"
        if (TypeChecker.is_divEffect(value)) return "Effect (Div)"
        if (TypeChecker.is_divIterator(value)) return "Iterator (Div)"
        if (TypeChecker.is_dogeiscutObject(value)) return "Object (DogeisCut)"
        if (TypeChecker.is_dogeiscutRegularExpression(value)) return "Regular Expression (DogeisCut)"
        if (TypeChecker.is_dogeiscutSet(value)) return "Set (DogeisCut)"
        if (TypeChecker.is_externaltimer(value)) return "External Timer (steve0greatness)"
        if (TypeChecker.is_jwArray(value)) return "Array (jwklong)"
        if (TypeChecker.is_jwColor(value)) return "Color (jwklong)"
        if (TypeChecker.is_jwDate(value)) return "Date (jwklong)"
        if (TypeChecker.is_jwLambda(value)) return "Lambda (jwklong)"
        if (TypeChecker.is_jwNum(value)) return "Number (jwklong)"
        if (TypeChecker.is_jwTarget(value)) return "Target (jwklong)"
        if (TypeChecker.is_jwVector(value)) return "Vector (jwklong)"
        if (TypeChecker.is_jwXML(value)) return "XML (jwklong)"
        if (TypeChecker.is_canvasData(value)) return "Canvas (RedMan13)"
        if (TypeChecker.is_paintUtilsColour(value)) return "Paint Utils Colour (Fruits555000)"

        // Rare/Overlapping JS data types
        if (typeof value === "bigint") return "JavaScript BigInt"
        if (typeof value === "symbol") return "JavaScript Symbol"
        if (typeof value === "function") return "JavaScript Function"
        if (typeof value === "object") return "JavaScript Object (generic)"

        return "Unknown (rare)"
    }
}


class TestRunner {
    constructor () {
        this._testScopes = []
        this.quote = quote
        this.TypeChecker = TypeChecker
        this.TestError = TestError
    }

    /** @returns {Object} */
    getInfo () {
        const commonArguments = {
            boolean: {
                type: ArgumentType.BOOLEAN,
            },
            errorMessage: {
                type: ArgumentType.STRING,
                defaultValue: "test failed"
            },
            allowAnything: {
                type: ArgumentType.STRING,
                exemptFromNormalization: true,
            },
        }

        const info = {
            id: 'gceTestRunner',
            name: 'Test Runner',
            color1: '#4a9e6b',
            color2: '#3d8a5e',
            color3: '#2e7050',
            menuIconURI: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICB2aWV3Qm94PSIwIDAgMjAgMjAiCiAgdmVyc2lvbj0iMS4xIgogIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPGNpcmNsZQogICAgY3g9IjEwIgogICAgY3k9IjEwIgogICAgcj0iOSIKICAgIHN0eWxlPSJmaWxsOiM0YTllNmI7IHN0cm9rZTojMmU3MDUwOyBzdHJva2Utd2lkdGg6MnB4OyBmaWxsLW9wYWNpdHk6MTsgc3Ryb2tlLW9wYWNpdHk6MTsgcGFpbnQtb3JkZXI6c3Ryb2tlIiAvPgogIDxwYXRoCiAgICBkPSJNIDcuNSAyLjc1IEggMTIuNSBMIDEyIDMuNzUgViA3Ljc1IEwgMTUuNSAxNS43NSBIIDQuNSBMIDggNy43NSBWIDMuNzUgTCA3LjUgMi43NSBaIE0gOSAzLjI1IEggMTEuMzc1IEwgMTEgMy44NzUgViA4LjM3NSBMIDE0IDE0Ljg3NSBIIDYgTCA5IDguMzc1IFYgMy44NzUgTCA4LjYyNSAzLjI1IFoiCiAgICBzdHlsZT0iZmlsbDojZmZmZmZmOyBmaWxsLXJ1bGU6ZXZlbm9kZCIgLz4KPC9zdmc+Cg==",
            blocks: [
                {
                    opcode: 'testScope',
                    blockType: BlockType.CONDITIONAL,
                    text: 'test scope named [NAME]',
                    tooltip: 'Runs the enclosed blocks and properly reports any errors with a scopes traceback path.',
                    arguments: {
                        NAME: { type: ArgumentType.STRING, defaultValue: 'test for my custom block' }
                    }
                },
                '---',
                {
                    opcode: 'assert',
                    blockType: BlockType.COMMAND,
                    text: 'assert [CONDITION]',
                    tooltip: 'Fails when the condition is false.',
                    arguments: {
                        CONDITION: commonArguments.boolean,
                    }
                },
                {
                    opcode: 'assertNot',
                    blockType: BlockType.COMMAND,
                    text: 'assert not [CONDITION]',
                    tooltip: 'Fails when the condition is true.',
                    arguments: {
                        CONDITION: commonArguments.boolean,
                    }
                },
                {
                    opcode: 'assertMsg',
                    blockType: BlockType.COMMAND,
                    text: 'assert [CONDITION] message [MSG]',
                    tooltip: 'Fails when the condition is false and adds the message in the thrown error.',
                    arguments: {
                        CONDITION: commonArguments.boolean,
                        MSG: commonArguments.errorMessage,
                    }
                },
                {
                    opcode: 'assertNotMsg',
                    blockType: BlockType.COMMAND,
                    text: 'assert not [CONDITION] message [MSG]',
                    tooltip: 'Fails when CONDITION is true and adds the message in the thrown error',
                    arguments: {
                        CONDITION: commonArguments.boolean,
                        MSG: commonArguments.errorMessage
                    }
                },
                "---",
                {
                    opcode: 'assertStrictEqual',
                    blockType: BlockType.COMMAND,
                    text: 'assert typed equality [A] = [B]',
                    tooltip: 'Compares A and B as raw values without converting to strings (strict typed check).',
                    arguments: {
                        A: commonArguments.allowAnything,
                        B: commonArguments.allowAnything,
                    }
                },
                {
                    opcode: 'assertStrictNotEqual',
                    blockType: BlockType.COMMAND,
                    text: 'assert typed inequality [A] != [B]',
                    tooltip: 'Compares A and B as raw values without converting to strings (strict typed check).',
                    arguments: {
                        A: commonArguments.allowAnything,
                        B: commonArguments.allowAnything,
                    }
                },
                {
                    opcode: 'assertUnstrictEqual',
                    blockType: BlockType.COMMAND,
                    text: 'assert string equality [A] = [B]',
                    tooltip: 'Converts both inputs to strings first, then checks for equal text.',
                    arguments: {
                        A: commonArguments.allowAnything,
                        B: commonArguments.allowAnything,
                    }
                },
                {
                    opcode: 'assertUnstrictNotEqual',
                    blockType: BlockType.COMMAND,
                    text: 'assert string inequality [A] != [B]',
                    tooltip: 'Converts both inputs to strings first, then checks they differ as text.',
                    arguments: {
                        A: commonArguments.allowAnything,
                        B: commonArguments.allowAnything,
                    }
                },
                {
                    opcode: 'assertTextInValue',
                    blockType: BlockType.COMMAND,
                    text: 'assert text [TEXT] in value [VALUE]',
                    tooltip: 'Converts both inputs to strings and asserts value contains text.',
                    arguments: {
                        TEXT: { type: ArgumentType.STRING, defaultValue: 'sit amet' },
                        VALUE: { type: ArgumentType.STRING, defaultValue: 'Lorem ipsum dolor sit amet, consetetur' },
                    }
                },
                {
                    opcode: 'assertTextNotInValue',
                    blockType: BlockType.COMMAND,
                    text: 'assert text [TEXT] not in value [VALUE]',
                    tooltip: 'Converts both inputs to strings and asserts value does not contain text.',
                    arguments: {
                        TEXT: { type: ArgumentType.STRING, defaultValue: 'hello' },
                        VALUE: { type: ArgumentType.STRING, defaultValue: 'hello world' }
                    }
                },
                {
                    opcode: 'assertType',
                    blockType: BlockType.COMMAND,
                    text: 'assert type of [VALUE] is [EXPECTED]',
                    tooltip: 'Checks the value against types from common extensions and defaults to JavaScript base types.',
                    arguments: {
                        VALUE: commonArguments.allowAnything,
                        EXPECTED: { type: ArgumentType.STRING, menu: 'expectedType' }
                    }
                },
                {
                    opcode: 'assertCustomIdType',
                    blockType: BlockType.COMMAND,
                    text: 'assert custom id of [VALUE] is [EXPECTED]',
                    tooltip: 'Checks the `customID` property of a PM custom type. This also supports custom types from uncommon or new extensions.',
                    arguments: {
                        VALUE: commonArguments.allowAnything,
                        EXPECTED: { type: ArgumentType.STRING, defaultValue: 'jwArray' }
                    }
                },                
                "---",
                {
                    opcode: 'assertThrows',
                    blockType: BlockType.CONDITIONAL,
                    branchCount: 1,
                    text: 'assert throws error',
                    tooltip: 'Runs enclosed blocks and fails unless an error is thrown.',
                },
                {
                    opcode: 'assertThrowsContains',
                    blockType: BlockType.CONDITIONAL,
                    branchCount: 1,
                    text: 'assert throws error containing [MSG]',
                    tooltip: 'Runs enclosed blocks and fails unless an error is thrown and it\'s message contains the text.',
                    arguments: {
                        MSG: commonArguments.errorMessage,
                    }
                },
                {
                    opcode: 'assertDoesNotThrow',
                    blockType: BlockType.CONDITIONAL,
                    branchCount: 1,
                    text: 'assert does not throw error',
                    tooltip: 'Runs enclosed blocks and fails if any error is thrown.',
                },
                "---",
                {
                    opcode: 'failTest',
                    blockType: BlockType.COMMAND,
                    text: 'fail test with message [MSG]',
                    tooltip: 'Throws a custom error to indicate a test failed. You can also use the "throw" block from controls of course.',
                    arguments: {
                        MSG: commonArguments.errorMessage,
                    }
                },
            ],
            menus: {
                expectedType: {
                    acceptReporters: true,
                    acceptReporters: true,
                    items: [
                        "Boolean",
                        "Number",
                        "String",

                        "Buffer (AndrewGaming587)",
                        "Buffer Pointer (AndrewGaming587)",
                        "Date (Old Version) (ddededodediamante)",
                        "Date (ddededodediamante)",
                        "Effect (Div)",
                        "Iterator (Div)",
                        "Object (DogeisCut)",
                        "Regular Expression (DogeisCut)",
                        "Set (DogeisCut)",
                        "External Timer (steve0greatness)",
                        "Array (jwklong)",
                        "Color (jwklong)",
                        "Date (jwklong)",
                        "Lambda (jwklong)",
                        "Number (jwklong)",
                        "Target (jwklong)",
                        "Vector (jwklong)",
                        "XML (jwklong)",
                        "Canvas (RedMan13)",
                        "Paint Utils Colour (Fruits555000)",

                        "JavaScript Undefined",
                        "JavaScript Null",
                        "JavaScript BigInt",
                        "JavaScript Symbol",
                        "JavaScript Function",
                        "JavaScript Object (generic)",
                        "Unknown (rare)"
                    ]
                }
            }
        }
        return info
    }

    /** @returns {Object} */
    getCompileInfo() {
        const EXTENSION_PREFIX = "runtime.ext_gceTestRunner"

        /**
         * @param {string} kind
         * @param {Array<string>} inputs
         * @returns {(generator: *, block: *) => Object<string, *>}
         */
        const createIRGenerator = (kind, inputs) => ((generator, block) => {
            const result = { kind }
            inputs.forEach(inputName => {
                result[inputName] = inputName === "SUBSTACK"
                    ? generator.descendSubstack(block, inputName)
                    : generator.descendInputOfBlock(block, inputName)
            })
            return result
        })

        /**
         * @param {*} compiler
         * @param {*} substack
         * @param {*} imports
         * @returns {void}
         */
        const addSubstackCode = (compiler, substack, imports) => {
            compiler.descendStack(substack, new imports.Frame(false, undefined, true))
        }

        const irInfo = {
            testScope:            createIRGenerator("stack", ["NAME", "SUBSTACK"]),
            assertThrows:         createIRGenerator("stack", ["SUBSTACK"]),
            assertThrowsContains: createIRGenerator("stack", ["MSG", "SUBSTACK"]),
            assertDoesNotThrow:   createIRGenerator("stack", ["SUBSTACK"]),
        }

        const jsInfo = {
            testScope: (node, compiler, imports) => {
                const nameLocal = compiler.localVariables.next()
                const errLocal = compiler.localVariables.next()
                compiler.source += `const ${nameLocal} = ${compiler.descendInput(node.NAME).asString()};\n`
                compiler.source += `${EXTENSION_PREFIX}._testScopes.push(${nameLocal})\n`
                compiler.source += `try {\ntry {\n`
                addSubstackCode(compiler, node.SUBSTACK, imports)
                compiler.source += `} catch (${errLocal}) {\n`
                compiler.source += `  throw ${EXTENSION_PREFIX}._wrapError(\`test scope \${${EXTENSION_PREFIX}.quote(${nameLocal})}:\`, ${errLocal});\n`
                compiler.source += `}} finally {\n${EXTENSION_PREFIX}._testScopes.pop();\n}\n`
            },
            assertThrows: (node, compiler, imports) => {
                const errLocal = compiler.localVariables.next()
                const catchLocal = compiler.localVariables.next()
                compiler.source += `let ${errLocal};\n`
                compiler.source += `try {\n`
                addSubstackCode(compiler, node.SUBSTACK, imports)
                compiler.source += `} catch (${catchLocal}) { ${errLocal} = ${catchLocal}; }\n`
                compiler.source += `if (!${errLocal}) throw new ${EXTENSION_PREFIX}.TestError("Expected exception but none was thrown");\n`
            },
            assertThrowsContains: (node, compiler, imports) => {
                const errLocal = compiler.localVariables.next()
                const catchLocal = compiler.localVariables.next()
                const expectedLocal = compiler.localVariables.next()
                compiler.source += `let ${errLocal};\n`
                compiler.source += `try {\n`
                addSubstackCode(compiler, node.SUBSTACK, imports)
                compiler.source += `} catch (${catchLocal}) { ${errLocal} = ${catchLocal}; }\n`
                compiler.source += `const ${expectedLocal} = ${compiler.descendInput(node.MSG).asString()};\n`
                compiler.source += `if (!${errLocal}) throw new ${EXTENSION_PREFIX}.TestError("Expected exception but none was thrown");\n`
                compiler.source += `if (!${EXTENSION_PREFIX}.TestError.errorContainsMsg(${errLocal}, ${expectedLocal})) `+
                    `throw ${EXTENSION_PREFIX}._errorWithCause(\`Expected exception containing \${${EXTENSION_PREFIX}.quote(${expectedLocal})} but got \${${EXTENSION_PREFIX}.quote(${EXTENSION_PREFIX}.TestError.getActualErrorMessage(${errLocal}))}\`, ${errLocal});\n`
            },
            assertDoesNotThrow: (node, compiler, imports) => {
                const errLocal = compiler.localVariables.next()
                const catchLocal = compiler.localVariables.next()
                compiler.source += `let ${errLocal};\n`
                compiler.source += `try {\n`
                addSubstackCode(compiler, node.SUBSTACK, imports)
                compiler.source += `} catch (${catchLocal}) { ${errLocal} = ${catchLocal}; }\n`
                compiler.source += `if (${errLocal}) throw ${EXTENSION_PREFIX}._errorWithCause(\`Unexpected exception: \${${EXTENSION_PREFIX}._errorMessage(${errLocal})}\`, ${errLocal});\n`
            },
            failTest: (node, compiler) => {
                compiler.source += `throw new ${EXTENSION_PREFIX}.TestError(\`Test failed: \${${compiler.descendInput(node.MSG).asString()}}\`);\n`
            },
        }

        return { ir: irInfo, js: jsInfo }
    }

    // Compiled-only blocks
    testScope = this._isACompiledBlock
    assertThrows = this._isACompiledBlock
    assertThrowsContains = this._isACompiledBlock
    assertDoesNotThrow = this._isACompiledBlock

    _isACompiledBlock() {
        throw new TestError(
            "This block only works in compiled mode. " +
            "Make sure the Test Runner extension is registered with compiled block support."
        )
    }

    /** @param {Object} args */
    assert ({CONDITION}) {
        CONDITION = Cast.toBoolean(CONDITION)
        if (!CONDITION) throw new TestError("Assertion failed: condition was false")
    }

    /** @param {Object} args */
    assertNot ({CONDITION}) {
        CONDITION = Cast.toBoolean(CONDITION)
        if (CONDITION) throw new TestError("Assertion failed: condition was true")
    }

    /** @param {Object} args */
    assertMsg ({CONDITION, MSG}) {
        CONDITION = Cast.toBoolean(CONDITION)
        MSG = Cast.toString(MSG)
        if (!CONDITION) throw new TestError(`Assertion failed: condition was false: ${MSG}`)
    }

    /** @param {Object} args */
    assertNotMsg ({CONDITION, MSG}) {
        CONDITION = Cast.toBoolean(CONDITION)
        MSG = Cast.toString(MSG)
        if (CONDITION) throw new TestError(`Assertion failed: condition was true: ${MSG}`)
    }

    /** @param {Object} args */
    assertStrictEqual ({A, B}) {
        if (A !== B) throw new TestError(`Assertion failed: got ${this._valueWithType(A)}, expected ${this._valueWithType(B)}`)
    }

    /** @param {Object} args */
    assertStrictNotEqual ({A, B}) {
        if (A === B) throw new TestError(`Assertion failed: values unexpectedly equal: ${this._valueWithType(A)} and ${this._valueWithType(B)}`)
    }

    /** @param {Object} args */
    assertUnstrictEqual ({A, B}) {
        const aStr = Cast.toString(A)
        const bStr = Cast.toString(B)
        if (aStr !== bStr) throw new TestError(`Assertion failed: got ${quote(aStr)}, expected ${quote(bStr)}`)
    }

    /** @param {Object} args */
    assertUnstrictNotEqual ({A, B}) {
        const aStr = Cast.toString(A)
        const bStr = Cast.toString(B)
        if (aStr === bStr) throw new TestError(`Assertion failed: values unexpectedly equal: ${quote(aStr)}`)
    }

    /** @param {Object} args */
    assertTextInValue ({TEXT, VALUE}) {
        const textStr = Cast.toString(TEXT)
        const valueStr = Cast.toString(VALUE)
        if (!valueStr.includes(textStr)) throw new TestError(`Assertion failed: text ${quote(textStr)} not found in value ${quote(valueStr)}`)
    }

    /** @param {Object} args */
    assertTextNotInValue ({TEXT, VALUE}) {
        const textStr = Cast.toString(TEXT)
        const valueStr = Cast.toString(VALUE)
        if (valueStr.includes(textStr)) throw new TestError(`Assertion failed: text ${quote(textStr)} unexpectedly found in value ${quote(valueStr)}`)
    }

    /** @param {Object} args */
    assertType ({VALUE, EXPECTED}) {
        const expectedType = Cast.toString(EXPECTED)
        const actualType = this.TypeChecker.stringTypeof(VALUE)
        if (actualType !== expectedType) {
            throw new TestError(
                `Assertion failed: expected type ${quote(expectedType)} but got ${quote(actualType)} for value ${quote(VALUE)}`
            )
        }
    }

    /** @param {Object} args */
    assertCustomIdType ({VALUE, EXPECTED}) {
        const expectedType = Cast.toString(EXPECTED)
        let customId
        if (typeof VALUE === "object") {
            if (VALUE && typeof VALUE.customId === "string") {
                customId = VALUE.customId
            } else {
                customId = "<invalid-custom-id>"
            }
        } else {
            customId = "<not-an-object>"
        }
        if (customId !== expectedType) {
            throw new TestError(
                `Assertion failed: expected custom id ${quote(expectedType)} but got ${quote(customId)} for value ${quote(VALUE)}`
            )
        }
    }

    /** @param {Object} args */
    failTest ({MSG}) {
        throw new TestError(`Test failed: ${Cast.toString(MSG)}`)
    }



    /**
     * @param {*} error
     * @returns {string}
     */
    _errorMessage (error) {
        return this._formatErrorLines(error).join("\n")
    }

    /**
     * @param {*} value
     * @returns {string}
     */
    _typeLabel (value) {
        if (value === null) return "null"
        if (value === undefined) return "undefined"
        const baseType = typeof value
        const ctorName = value && value.constructor && value.constructor.name
        return ctorName ? `${baseType} (${ctorName})` : baseType
    }

    /**
     * @param {*} value
     * @returns {string}
     */
    _valueWithType (value) {
        return `${quote(value)} [${this._typeLabel(value)}]`
    }

    /**
     * @param {string} message
     * @param {*} cause
     * @returns {TestError}
     */
    _wrapError (message, cause) {
        const combinedMessage = [
            message,
            ...this._formatErrorLines(cause)
        ].join("\n")
        const innerActualMessage = TestError.preserveActualMessage(null, cause)
        return this._errorWithCause(combinedMessage, cause, message, innerActualMessage)
    }

    /**
     * @param {string} message
     * @param {*} cause
     * @param {?string} [scopePrefix]
     * @param {?string} [actualMessage]
     * @returns {TestError}
     */
    _errorWithCause (message, cause, scopePrefix = null, actualMessage = null) {
        return new TestError(message, {
            cause,
            scopePrefix,
            actualMessage: TestError.preserveActualMessage(actualMessage, cause)
        })
    }

    /**
     * @param {*} error
     * @returns {Array<string>}
     */
    _formatErrorLines (error) {
        if (!(error instanceof Error)) return [String(error)]
        return String(error.message).split("\n")
    }
}

const testRunnerInstance = new TestRunner()
const runtime = Scratch.vm.runtime

if (isRuntimeEnv) {
    const oldConvertBlock = runtime._convertBlockForScratchBlocks.bind(runtime)
    if (!oldConvertBlock.tooltipImplementationAdded) {
        /**
         * @param {Object} blockInfo
         * @param {Object} categoryInfo
         * @returns {Object}
         */
        runtime._convertBlockForScratchBlocks = function (blockInfo, categoryInfo) {
            const result = oldConvertBlock(blockInfo, categoryInfo)
            if (blockInfo.tooltip) {
                result.json.tooltip = blockInfo.tooltip
            }
            return result
        }
        runtime._convertBlockForScratchBlocks.tooltipImplementationAdded = true
    }
}

Scratch.extensions.register(testRunnerInstance)
if (isRuntimeEnv) {
    Scratch.vm.runtime.registerCompiledExtensionBlocks(
        "gceTestRunner", testRunnerInstance.getCompileInfo(),
    )
}
})(Scratch)
