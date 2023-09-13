import { Nodes } from "./ast";

const enum TagType {
  START,
  END,
}

export function baseParse(content) {
  // 创建上下文对象
  const context = createParserContext(content);
  return createRoot(parseChildren(context));
}

function parseChildren(context) {
  const nodes: any[] = [];
  let node;
  const s = context.source;
  if (s.startsWith("{{")) {
    // 如果字符以 {{ 开头，认为是插值
    node = parseInterpolation(context);
  } else if (s[0] === "<") {
    if (/[a-z]/i.test(s[1])) {
      node = parseElement(context);
    }
  }

  nodes.push(node);

  return nodes;
}

function parseElement(context) {
  const tag = parseTag(context, TagType.START);

  parseTag(context, TagType.END);

  return tag;
}

function parseTag(context, type: TagType) {
  //  [ '<div', 'div', index: 0, input: '<div></div>', groups: undefined ]
  const match: any = /^<\/?([a-z]*)/i.exec(context.source);
  // div
  const tag = match[1];

  advanceBy(context, match[0].length + 1);

  if (type === TagType.END) return;

  return {
    type: Nodes.ELEMENT,
    tag,
  };
}

function parseInterpolation(context) {
  // {{msg}}
  const openDelimiter = "{{";
  const closeDelimiter = "}}";

  const startIndex = openDelimiter.length;
  const closeIndex = context.source.indexOf(closeDelimiter, startIndex);

  // 推进下一步处理
  advanceBy(context, startIndex); // msg}}

  const rawContentLength = closeIndex - startIndex;

  const content = context.source.slice(0, rawContentLength).trim(); // msg

  console.log("content", content);

  // 推进下一步处理
  advanceBy(context, rawContentLength + closeDelimiter.length);

  return {
    type: Nodes.INTERPOLATION,
    content: {
      type: Nodes.SIMPLE_EXPRESSON,
      content: content,
    },
  };
}

function advanceBy(context, length) {
  context.source = context.source.slice(length);
}

function createRoot(children) {
  return {
    children,
  };
}

function createParserContext(content: any) {
  return {
    source: content,
  };
}