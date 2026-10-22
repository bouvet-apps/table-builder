[#if title.text?has_content || preface.text?has_content || rows?has_content || footnotes.text?has_content]
  <div class="table-show ${paddingClass!''}">
    [#if title.text?has_content]
      <${title.type!'h3'} class="table-show__title" style="${title.style!''}">${title.text!''}</${title.type!'h3'}>
    [/#if]
    [#if preface.text?has_content]
      <p class="table-show__preface" style="${preface.style!''}">${preface.text!''}</p>
    [/#if]
    <div class="table-show__table-wrapper">
      <table class="table-show__table">
        [#list rows as row]
          <tr class="table-show__table__row" style="${row.style!''}">
            [#list row.cells as cell]
              <td class="table-show__table__cell" style="${cell.style!''}">
                ${cell.value}
              </td>
            [/#list]
          </tr>
        [/#list]
      </table>
    </div>
    [#if footnotes.text?has_content]
      <div class="table-show__footnotes" style="${footnotes.style!''}">${footnotes.text!''}</div>
    [/#if]
  </div>
[/#if]
